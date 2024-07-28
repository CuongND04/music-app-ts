"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.result = void 0;
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const convertToSlug_1 = require("../../helpers/convertToSlug");
// [GET] /search/:type
const result = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.params.type;
        // lấy keyword sau dấu ? trên url
        const keyword = `${req.query.keyword}`;
        // tạo một cái title không phân biệt chữ hoa, thường
        const keywordRegex = new RegExp(keyword, "i");
        // Tạo ra slug không dấu, có thêm dấu -
        const stringSlug = (0, convertToSlug_1.convertToSlug)(keyword);
        // tạo một cái slug không phân biệt chữ hoa, thường
        const stringSlugRegex = new RegExp(stringSlug, "i");
        // tìm bài hát có tên chứa regex, và slug chứa regex
        const songs = yield song_model_1.default.find({
            $or: [{ title: keywordRegex }, { slug: stringSlugRegex }],
        }).select("avatar title singerId like slug");
        // lọc qua danh sách kết quả
        let newSongs = [];
        for (const item of songs) {
            // tìm ca sĩ hát bài đó
            const singer = yield singer_model_1.default.findOne({
                _id: item.singerId,
                deleted: false,
            }).select("fullName");
            // tạo thông tin của ca sĩ trong bài hát
            item["singer"] = singer;
            newSongs.push({
                id: item.id,
                title: item.title,
                avatar: item.avatar,
                like: item.like,
                slug: item.slug,
                singer: {
                    fullName: singer.fullName,
                },
            });
        }
        switch (type) {
            case "result":
                res.render("client/pages/search/result", {
                    pageTitle: `Kết quả: ${keyword}`,
                    keyword: keyword,
                    songs: newSongs,
                });
                break;
            case "suggest":
                res.json({
                    code: 200,
                    message: "Thành công",
                    songs: newSongs,
                });
                break;
            default:
                break;
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.result = result;
