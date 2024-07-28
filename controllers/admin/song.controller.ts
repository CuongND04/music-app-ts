import { Request, Response } from "express";
import Song from "../../models/song.model";
import Topic from "../../models/topic.model";
import Singer from "../../models/singer.model";
import { systemConfig } from "../../config/config";
// [GET] /admin/songs/
export const index = async (req: Request, res: Response) => {
  const songs = await Song.find({
    deleted: false,
  });

  // console.log(songs);

  res.render("admin/pages/songs/index", {
    pageTitle: "Quản lý bài hát",
    songs: songs,
  });
};

// [GET] /admin/songs/create
export const create = async (req: Request, res: Response) => {
  const topics = await Topic.find({
    deleted: false,
  }).select("title");

  const singers = await Singer.find({
    deleted: false,
  }).select("fullName");

  res.render("admin/pages/songs/create", {
    pageTitle: "Thêm mới bài hát",
    topics: topics,
    singers: singers,
  });
};

// [POST] /admin/songs/create
export const createPost = async (req: Request, res: Response) => {
  if (req.body.avatar) {
    req.body.avatar = req.body.avatar[0];
  }

  if (req.body.audio) {
    req.body.audio = req.body.audio[0];
  }
  const song = new Song(req.body);
  await song.save();
  res.redirect(`/${systemConfig.prefixAdmin}/songs`);
};
// [GET] /admin/songs/edit/:id
export const edit = async (req: Request, res: Response) => {
  const id = req.params.id;
  // lấy bài hát dựa vào ID
  const song = await Song.findOne({
    _id: id,
    deleted: false,
  });
  // Lấy tiêu đề tất cả các chủ đề
  const topics = await Topic.find({
    deleted: false,
  }).select("title");
  // Lấy tên tất cả các ca sĩ
  const singers = await Singer.find({
    deleted: false,
  }).select("fullName");

  res.render("admin/pages/songs/edit", {
    pageTitle: "Chỉnh sửa bài hát",
    song: song,
    topics: topics,
    singers: singers,
  });
};
// [PATCH] /admin/songs/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  const id = req.params.id;
  // do nó là một mảng nên phải lấy phần tử đầu tiên
  if (req.body.avatar) {
    req.body.avatar = req.body.avatar[0];
  }
  if (req.body.audio) {
    req.body.audio = req.body.audio[0];
  }

  await Song.updateOne(
    {
      _id: id,
      deleted: false,
    },
    req.body
  );

  res.redirect(`back`);
};
