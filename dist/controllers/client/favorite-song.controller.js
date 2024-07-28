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
exports.index = void 0;
const favorite_model_1 = __importDefault(require("../../models/favorite.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
// [GET] /favorite-songs
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // tìm ra những item trong danh sách yêu thích
    const favoriteSongs = yield favorite_model_1.default.find({
        deleted: false,
        // userId: "",
    });
    for (const item of favoriteSongs) {
        // tìm thông tin bài hát đó dựa vào id trong item
        const song = yield song_model_1.default.findOne({
            _id: item.songId,
        }).select("avatar title slug singerId");
        // tìm thông tin ca sĩ đó dựa vào id trong bài hát
        const singer = yield singer_model_1.default.findOne({
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
});
exports.index = index;
