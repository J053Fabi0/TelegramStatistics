export default function getJSON(blob: Blob) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target?.result;
        if (!text || text instanceof ArrayBuffer) return;
        resolve(JSON.parse(text));
      };

      reader.readAsText(blob);
    } catch (e) {
      reject(e);
    }
  });
}
