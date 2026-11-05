import sanitizeHtml from "sanitize-html";

const dirty = [
  '<a href="jav&#x09;ascript:alert(1)">Click</a>',
  '<a href="javascript:alert(1)">Click</a>',
  '<a href="jav&#58;alert(1)">Click</a>',
  '<img src=x onerror=alert(1)>',
  '<script>alert(1)</script><p>Hello <strong>World</strong></p>',
  '<iframe src="https://evil.com"></iframe>',
  '<a href="https://ogheavyduty.in" target="_blank">Safe Link</a>',
  '<svg onload=alert(1)>'
];

const options = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
    'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'blockquote',
    'code', 'pre', 'ul', 'ol', 'li', 'a', 'table', 'thead',
    'tbody', 'tfoot', 'tr', 'th', 'td', 'figure', 'figcaption',
    'span', 'div', 'img', 'sub', 'sup'
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel', 'title'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    table: ['border', 'cellpadding', 'cellspacing', 'style'],
    th: ['colspan', 'rowspan', 'scope', 'align', 'style'],
    td: ['colspan', 'rowspan', 'align', 'style'],
    '*': ['class', 'id']
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: {
    img: ['http', 'https', 'data']
  },
  transformTags: {
    a: (tagName, attribs) => {
      const rel = attribs.rel ? attribs.rel.split(' ') : [];
      if (!rel.includes('noopener')) rel.push('noopener');
      if (!rel.includes('noreferrer')) rel.push('noreferrer');
      return {
        tagName: 'a',
        attribs: {
          ...attribs,
          rel: rel.join(' ')
        }
      };
    }
  }
};

dirty.forEach(v => {
  console.log('INPUT: ', v);
  console.log('OUTPUT:', sanitizeHtml(v, options));
});

