import unidecode from "unidecode";
export const convertToSlug = (text: string): string => {
  const unidecodeText = unidecode(text.trim()); // loại bỏ khoảng trắng 2 dầu
  const slug: string = unidecodeText.replace(/\s+/g, "-");
  return slug;
};
