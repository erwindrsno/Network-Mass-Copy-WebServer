export const extractDataFromTxt = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text
        .split(/\r?\n/) // Split by new lines
        .map(line => line.trim())
        .filter(line => line !== '') // Remove empty lines

      const title = lines[0]; // first line
      const records = lines.slice(1).map(line => {
        const [hostname, owner] = line.split('|').map(field => field.trim());
        return { hostname, owner };
      });

      resolve({ title, records });
    };

    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsText(file);
  })
}
