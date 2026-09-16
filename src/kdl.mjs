export function parseSimpleKdl(content) {
  const lines = content.split('\n');
  const root = { name: 'root', properties: {}, arguments: [], children: [] };
  const stack = [root];

  for (let i = 0; i < lines.length; i += 1) {
    let line = lines[i].trim();
    if (!line || line.startsWith('//')) continue;

    const opens = line.endsWith('{');
    if (opens) {
      line = line.slice(0, -1).trim();
    }
    const closes = line.startsWith('}');
    if (closes) {
      stack.pop();
      continue;
    }

    const matches = line.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    if (matches.length === 0) continue;

    const nodeName = matches[0];
    const node = { name: nodeName, properties: {}, arguments: [], children: [] };

    for (const part of matches.slice(1)) {
      if (part.includes('=')) {
        const [k, ...rest] = part.split('=');
        node.properties[k] = rest.join('=').replace(/^"|"$/g, '');
      } else {
        node.arguments.push(part.replace(/^"|"$/g, ''));
      }
    }

    stack[stack.length - 1].children.push(node);
    if (opens) {
      stack.push(node);
    }
  }

  return root;
}
