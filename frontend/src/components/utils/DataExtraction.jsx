export const extractDataFromTxt = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const array = text
        .split(/\r?\n/)
        .map(line => line.trim().replace(/,$/, ''))
        .filter(line => line !== '');

      resolve(array);
    };

    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsText(file);
  })
}
