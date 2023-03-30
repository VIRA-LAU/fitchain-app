export default function queryBuilder(params?: any) {
  if (!params) return "";
  const keys = Object.keys(params);
  if (keys.length === 1) return `?${keys[0]}=${params[keys[0]]}`;
  else {
    let output = "?";
    Object.keys(params).forEach((key, index: number) => {
      if (params[key]) {
        output = output + key + "=" + params[key];
        if (index + 1 !== keys.length) output = output + "&";
      }
    });
    return output;
  }
}
