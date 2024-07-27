import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import { convertToSlug } from "../../helpers/convertToSlug";

// [GET] /search/result
export const result = async (req: Request, res: Response) => {
  try {
    // lấy keyword sau dấu ? trên url
    const keyword: string = `${req.query.keyword}`;
    // tạo một cái title không phân biệt chữ hoa, thường
    const keywordRegex = new RegExp(keyword, "i");
    // Tạo ra slug không dấu, có thêm dấu -
    const stringSlug = convertToSlug(keyword);
    // tạo một cái slug không phân biệt chữ hoa, thường
    const stringSlugRegex = new RegExp(stringSlug, "i");
    // tìm bài hát có tên chứa regex, và slug chứa regex
    const songs = await Song.find({
      $or: [{ title: keywordRegex }, { slug: stringSlugRegex }],
    }).select("avatar title singerId like slug");
    // lọc qua danh sách kết quả
    for (const item of songs) {
      // tìm ca sĩ hát bài đó
      const singer = await Singer.findOne({
        _id: item.singerId,
        deleted: false,
      }).select("fullName");
      // tạo thông tin của ca sĩ trong bài hát
      item["singer"] = singer;
    }

    res.render("client/pages/search/result", {
      pageTitle: `Kết quả: ${keyword}`,
      keyword: keyword,
      songs: songs,
    });
  } catch (error) {
    console.log(error);
  }
};
