const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const { URL } = require('url');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public')));

function makeProxyUrl(url) {
  return '/proxy?url=' + encodeURIComponent(url);
}

function rewriteAttrValue(value, baseUrl) {
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('javascript:') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:') || trimmed.startsWith('data:')) {
    return value;
  }

  try {
    const absolute = new URL(trimmed, baseUrl).toString();
    return makeProxyUrl(absolute);
  } catch {
    return value;
  }
}

function rewriteSrcSet(value, baseUrl) {
  return value
    .split(',')
    .map((item) => {
      const parts = item.trim().split(/\s+/);
      if (!parts[0]) return item;
      const descriptor = parts.slice(1).join(' ');
      const rewrittenUrl = rewriteAttrValue(parts[0], baseUrl);
      return descriptor ? `${rewrittenUrl} ${descriptor}` : rewrittenUrl;
    })
    .join(', ');
}

function rewriteStyleUrls(styleValue, baseUrl) {
  return styleValue.replace(/url\(([^)]+)\)/gi, (match, value) => {
    const trimmed = value.trim().replace(/^['"]|['"]$/g, '');
    if (!trimmed || trimmed.startsWith('data:') || trimmed.startsWith('mailto:')) {
      return match;
    }

    try {
      const absolute = new URL(trimmed, baseUrl).toString();
      return `url('${makeProxyUrl(absolute)}')`;
    } catch {
      return match;
    }
  });
}

function rewriteHtml(html, baseUrl) {
  const $ = cheerio.load(html, { decodeEntities: false });

  $('[src], [href], [action], [poster], [data], [srcset], [style]').each((_, el) => {
    const element = $(el);

    ['src', 'href', 'action', 'poster', 'data'].forEach((attr) => {
      const attrValue = element.attr(attr);
      if (!attrValue) return;
      element.attr(attr, rewriteAttrValue(attrValue, baseUrl));
    });

    const srcsetValue = element.attr('srcset');
    if (srcsetValue) {
      element.attr('srcset', rewriteSrcSet(srcsetValue, baseUrl));
    }

    const styleValue = element.attr('style');
    if (styleValue) {
      element.attr('style', rewriteStyleUrls(styleValue, baseUrl));
    }
  });

  $('meta[http-equiv]').each((_, el) => {
    const element = $(el);
    const httpEquiv = (element.attr('http-equiv') || '').toLowerCase();
    if (httpEquiv === 'refresh') {
      const content = element.attr('content') || '';
      const match = content.match(/url=(.*)/i);
      if (match) {
        const rewrittenUrl = rewriteAttrValue(match[1], baseUrl);
        element.attr('content', content.replace(match[1], rewrittenUrl));
      }
    }
  });

  const baseTag = $('base');
  if (baseTag.length) {
    const baseHref = baseTag.attr('href');
    if (baseHref) {
      baseTag.attr('href', rewriteAttrValue(baseHref, baseUrl));
    }
  }

  $('meta[http-equiv="Content-Security-Policy"]').remove();
  $('meta[http-equiv="Content-Security-Policy-Report-Only"]').remove();

  return $.html();
}
function stripSecurityHeaders(headers) {
  const stripped = { ...headers };
  delete stripped['content-security-policy'];
  delete stripped['content-security-policy-report-only'];
  delete stripped['x-frame-options'];
  delete stripped['frame-options'];
  delete stripped['x-content-security-policy'];
  delete stripped['cross-origin-opener-policy'];
  delete stripped['cross-origin-embedder-policy'];
  delete stripped['cross-origin-resource-policy'];
  delete stripped['permissions-policy'];
  delete stripped['referrer-policy'];
  return stripped;
}

app.get('/proxy', async (req, res) => {
  const rawUrl = req.query.url;
  if (!rawUrl) return res.status(400).send('No URL provided.');

  let targetUrl;
  try {
    targetUrl = new URL(rawUrl);
  } catch (error) {
    return res.status(400).send('Invalid URL provided.');
  }

  try {
    const response = await axios.get(targetUrl.toString(), {
      responseType: 'arraybuffer',
      maxRedirects: 5,
      headers: {
        'User-Agent': 'D.D-Proxy/1.0',
        Accept: '*/*',
      },
    });

    const contentType = response.headers['content-type'] || 'application/octet-stream';
    const headers = stripSecurityHeaders(response.headers);
    Object.entries(headers).forEach(([name, value]) => {
      if (value !== undefined) {
        res.setHeader(name, value);
      }
    });
    res.setHeader('X-Frame-Options', 'ALLOWALL');

    if (contentType.includes('text/html')) {
      const html = response.data.toString('utf8');
      const rewritten = rewriteHtml(html, targetUrl.toString());
      return res.type('html').send(rewritten);
    }

    if (contentType.includes('application/javascript') || contentType.includes('text/javascript') || contentType.includes('application/json') || contentType.includes('text/css') || contentType.includes('image/') || contentType.includes('font/')) {
      res.type(contentType);
      return res.send(response.data);
    }

    res.type(contentType);
    res.send(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    if (error.response) {
      return res.status(error.response.status).send(error.response.data || 'Error fetching URL.');
    }
    res.status(500).send('Unable to fetch the requested URL.');
  }
});

app.listen(PORT, () => {
  console.log(`D.D Proxy running at http://localhost:${PORT}`);
});
