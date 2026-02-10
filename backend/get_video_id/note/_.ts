import dotenv from "dotenv";
import { getVideoId } from "../_";

dotenv.config();

;(async () => {
    console.log("start get-video-id test");

    let videoInfo;

    // 1
    videoInfo = getVideoId('https://www.youtube.com/watch?v=HRb7B9fPhfA');
    console.log('1:', videoInfo);

    // 2
    videoInfo = getVideoId('https://www.youtube.com/embed/BOr-RKGHOJ8?autoplay=1&loop=1&mute=1&playsinline=1&playlist=BOr-RKGHOJ8');
    console.log('2:', videoInfo);

    // 3
    videoInfo = getVideoId('https://www.invalidlink.com');
    console.log('3:', videoInfo);

    // 4
    videoInfo = getVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    console.log('4:', videoInfo);

    // 5
    videoInfo = getVideoId('https://youtu.be/dQw4213w9WgXcQ213');
    console.log('5:', videoInfo);

    // 6
    videoInfo = getVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=45s');
    console.log('6:', videoInfo);

    // 7
    videoInfo = getVideoId('https://www.youtube.com/playlist?list=PLl-K7zZEsYLmnJ_FpMOZgyg6XcIGBu2OX');
    console.log('7:', videoInfo);

    // 8
    videoInfo = getVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLl-K7zZEsYLmnJ_FpMOZgyg6XcIGBu2OX&index=3');
    console.log('8:', videoInfo);

    // 9
    videoInfo = getVideoId('https://www.youtube.com/channel/UC_x5XG1OV2P6uZZ5FSM9Ttw');
    console.log('9:', videoInfo);

    // 10
    videoInfo = getVideoId('https://www.youtube.com/c/GoogleDevelopers');
    console.log('10:', videoInfo);

    // 11
    videoInfo = getVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&live');
    console.log('11:', videoInfo);

    // 12
    videoInfo = getVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&start=60&end=120');
    console.log('12:', videoInfo);

    // 13
    videoInfo = getVideoId('https://www.youtube.com/results?search_query=cat+videos');
    console.log('13:', videoInfo);

    // 14
    videoInfo = getVideoId('https://www.youtube.com/shorts/dQw4w9WgXcQ');
    console.log('14:', videoInfo);

    // 15
    videoInfo = getVideoId('https://www.youtube.com/post/abc12345');
    console.log('15:', videoInfo);

    process.exit(0);
})();

export {};
