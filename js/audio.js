// 播放列表动画效果
var listButton = document.getElementsByClassName('list')[0];
var music_list = document.getElementsByClassName('music-list')[0];
var close_list = document.getElementsByClassName('close-list')[0];
var totalTime = document.getElementsByClassName('audio-time')[0];
var playTime = document.getElementsByClassName('play-time')[0];
var progressPlay = document.getElementsByClassName('pgs-play')[0];
var progressTotal = document.getElementsByClassName('pgs-total')[0];
var bodyBackground = document.querySelector('body'); // 背景元素
var recordImg = document.getElementsByClassName('rotate-play')[0]; // 唱片元素
var musicName = document.getElementsByClassName('music-name')[0]; // 音乐名
var musicAuthor = document.getElementsByClassName('author-name')[0]; // 作者

// 音乐数据
var musics = [
    ['Call of Silence', '泽野弘之'],
    ['繁星、新生，与你', '鸣潮'],
    ['第五十七次取消发送', '菲菲公主'],
    ['23215220225', '徐浙'],
];
var musicId = 0;
var modeId = 1; // 播放模式：1顺序，2循环，3随机

//展开列表
listButton.addEventListener('click', function() {
    music_list.classList.add('list-card-show');
    music_list.classList.remove('list-card-hide');
    music_list.style.display = 'block';
    close_list.style.display = 'block';
});

//收起列表
close_list.addEventListener('click', function() {
    music_list.classList.remove('list-card-show');
    music_list.classList.add('list-card-hide');
    close_list.style.display = 'none';
});

var audio = document.getElementById('audio');
var pause = document.getElementsByClassName('icon-play')[0];
var mode = document.getElementsByClassName('mode')[0]; // 模式按钮
var MV = document.querySelector('.MV'); 

function initMusic() {
    audio.src = `mp3/music${musicId}.mp3`;
    audio.load();
    // 初始设置背景和唱片
    bodyBackground.style.backgroundImage = `url('./images/bg${musicId}.png')`;
    recordImg.style.backgroundImage = `url('./images/record${musicId}.jpg')`;
    
    //歌曲信息加载完成
    audio.ondurationchange = function() {
        musicName.innerText = musics[musicId][0];
        musicAuthor.innerText = musics[musicId][1];
        totalTime.innerText = transTime(audio.duration);
    }
}


// 切换音乐并播放
function switchMusic() {
    initMusic();
    audio.play();
    pause.classList.remove('icon-play');
    pause.classList.add('icon-pause');
    rotateRecord();
}

initMusic();

// 点击播放按钮
pause.addEventListener('click', function() {
    if(audio.paused) {
        audio.play();
        rotateRecord();
        pause.classList.remove('icon-play');
        pause.classList.add('icon-pause');
    } else {
        audio.pause();
        rotateRecordStop();
        pause.classList.remove('icon-pause');
        pause.classList.add('icon-play');
    }
});

//唱片旋转设置
var rotate = 0;
function rotateRecord() {
    recordImg.style.animationPlayState = 'running';
}
function rotateRecordStop() {
    recordImg.style.animationPlayState = 'paused';
}

//音频播放时间换算
function transTime(value) {
  var time = '';
  var h = parseInt(value / 3600);
  value %= 3600;
  var m = parseInt(value / 60);
  var s = parseInt(value % 60);
  if (h > 0) {
    time = formatTime(h + ':' + m + ':' + s);
  } else {
    time = formatTime(m + ':' + s);
  }
  return time;
}

// 格式化时间
function formatTime(value) {
  var time = '';
  var s = value.split(':');
  for (var i = 0; i < s.length; i++) {
    time += s[i].padStart(2, '0');
    if (i < s.length - 1) time += ':';
  }
  return time;
}

// 进度条
audio.addEventListener('timeupdate', updataProgress);
function updataProgress() {
    var value = audio.currentTime / audio.duration;
    progressPlay.style.width = value * 100 + '%';
    playTime.innerText = transTime(audio.currentTime);
}

progressTotal.addEventListener('mousedown', function(event) {
    var pgswidth = progressTotal.offsetWidth;
    var rate = event.offsetX / pgswidth;
    audio.currentTime = rate * audio.duration;
    updataProgress();
});

//音量控制
var volumeButton = document.getElementsByClassName('volume')[0];
var volumnTogger = document.getElementById('volumn-togger');
var lastVolume = 70;
audio.volume = lastVolume / 100;

volumnTogger.addEventListener('input', function() {
    audio.volume = volumnTogger.value / 100;
    audio.muted = false;
    volumeButton.style.backgroundImage = "url('./images/音量.png')";
});

//点击静音
volumeButton.addEventListener('click', function() {
    audio.muted = !audio.muted;
    if(audio.muted) {
        lastVolume = volumnTogger.value;
        volumnTogger.value = 0;
        volumeButton.style.backgroundImage = "url('./images/静音.png')";
    } else {
        volumnTogger.value = lastVolume;
        volumeButton.style.backgroundImage = "url('./images/音量.png')";
    }
});

// 上一首
var skipForward = document.getElementsByClassName('s-left')[0];
skipForward.addEventListener('click', function() {
    musicId--;
    if(musicId < 0) musicId = musics.length - 1;
    switchMusic();
});

// 下一首
var skipBackward = document.getElementsByClassName('s-right')[0];
skipBackward.addEventListener('click', function() {
    musicId++;
    if(musicId >= musics.length) musicId = 0;
    switchMusic();
});

// 倍速
var speed = document.getElementsByClassName('speed')[0];
speed.addEventListener('click', function() {
    var speeds = {
        '1.0x': ['1.5x', 1.5],
        '1.5x': ['2.0x', 2.0],
        '2.0x': ['0.5x', 0.5],
        '0.5x': ['1.0x', 1.0]
    };
    var newState = speeds[speed.innerText];
    speed.innerText = newState[0];
    audio.playbackRate = newState[1];
});

// MV功能
MV.addEventListener('click', function() {
    window.sessionStorage.setItem('musicId', musicId);
    window.open(`mp4/video${musicId}.mp4`, '_blank'); 
});



// 播放模式设置
mode.addEventListener('click', function() {
    modeId = (modeId % 3) + 1;
    mode.style.backgroundImage = `url('./images/mode${modeId}.png')`;
});

// 音频结束时处理播放模式
audio.onended = function() {
    if (modeId === 1) { // 顺序播放
        musicId = (musicId + 1) % musics.length;
        switchMusic();
    } else if (modeId === 2) { // 单曲循环
        audio.currentTime = 0;
        audio.play();
    } else if (modeId === 3) { // 随机播放
        var oldId = musicId;
        while (musicId === oldId) {
            musicId = Math.floor(Math.random() * musics.length);
        }
        switchMusic();
    }
};

// 绑定列表音乐
document.querySelectorAll('.all-list > div').forEach((item, index) => {
    item.addEventListener('click', function() {
        musicId = index;
        switchMusic();
        // 关闭列表
        music_list.classList.remove('list-card-show');
        music_list.classList.add('list-card-hide');
        close_list.style.display = 'none';
    });
});


// 初始化设置
bodyBackground.style.backgroundImage = `url('./images/bg0.png')`;
recordImg.style.backgroundImage = `url('./images/record0.jpg')`;