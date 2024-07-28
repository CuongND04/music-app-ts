tinymce.init({
  selector: "textarea.textarea-mce", // cho thuộc tính mce vào class mới ăn
  plugins: "image",
  image_title: true,
  images_upload_url: "/admin/upload",
  automatic_uploads: true,
  file_picker_types: "image",
});
