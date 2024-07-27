import { Response, Request } from "express";
import FavoriteSong from "../../models/favorite.model";
import Singer from "../../models/singer.model";
import Song from "../../models/song.model";

// [GET] /favorite-songs
export const index = async (req: Request, res: Response) => {
  // tìm ra những item trong danh sách yêu thích
  const favoriteSongs = await FavoriteSong.find({
    deleted: false,
    // userId: "",
  });
  for (const item of favoriteSongs) {
    // tìm thông tin bài hát đó dựa vào id trong item
    const song = await Song.findOne({
      _id: item.songId,
    }).select("avatar title slug singerId");
    // tìm thông tin ca sĩ đó dựa vào id trong bài hát
    const singer = await Singer.findOne({
      _id: song["singerId"],
    }).select("fullName");
    // thêm hai thuộc tính cho object item
    item["song"] = song;
    item["singer"] = singer;
  }

  res.render("client/pages/favorite-songs/index", {
    pageTitle: "Yêu thích",
    favoriteSongs: favoriteSongs,
  });
};
