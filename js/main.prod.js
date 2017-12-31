var Scene = /** @class */ (function () {
    function Scene(option) {
        this.xOffset = 0;
        var stage = option.stage, audioEle = option.audioEle, musicEle = option.musicEle, picNum = option.picNum, picsTotalWidth = option.picsTotalWidth;
        this.stage = stage;
        this.audioEle = audioEle;
        this.musicEle = musicEle;
        this.picNum = picNum;
        this.picsTotalWidth = picsTotalWidth;
        this.singlePicWidth = picsTotalWidth / picNum;
        this.init();
    }
    Scene.prototype.init = function () {
        this.insertPics();
        this.bindAudioEvent();
        this.bindTouchEvent();
        this.bindDeviceorientationEvent();
    };
    Scene.prototype.insertPics = function () {
        var picRadius = this.getPicRadius();
        for (var i = 1; i < this.picNum + 1; i++) {
            var tmpDiv = document.createElement("div");
            var backgroundUrl = "url(\"img/p" + i + ".png\") no-repeat center center";
            var transformDeg = "rotateY(" + 360 * i / this.picNum + "deg) translateZ(" + picRadius / 16 + "rem)";
            tmpDiv.style.background = backgroundUrl;
            tmpDiv.style.transform = transformDeg;
            this.stage.appendChild(tmpDiv);
        }
    };
    Scene.prototype.getPicRadius = function () {
        return Math.round(this.singlePicWidth / (2 * Math.tan(Math.PI / this.picNum))) - 3;
    };
    Scene.prototype.bindAudioEvent = function () {
        var _this = this;
        this.audioEle.addEventListener("touchend", function () {
            if (_this.musicEle.paused) {
                _this.audioEle.innerHTML = "🎺";
                _this.musicEle.play();
            }
            else {
                _this.audioEle.innerHTML = "⏸";
                _this.musicEle.pause();
            }
        });
    };
    Scene.prototype.bindTouchEvent = function () {
        var _this = this;
        this.stage.addEventListener("touchstart", function (e) {
            e.preventDefault();
            var touch = e.targetTouches[0];
            _this.startPos = touch.pageX - _this.xOffset;
        });
        this.stage.addEventListener("touchmove", function (e) {
            e.preventDefault();
            if (_this.orientationFlag) {
                return;
            }
            var touch = e.targetTouches[0];
            var pos = touch.pageX;
            _this.xOffset = pos - _this.startPos;
            _this.stage.style.transform = "rotateY(" + _this.xOffset + "deg)";
        });
    };
    Scene.prototype.bindDeviceorientationEvent = function () {
        var _this = this;
        // 该事件需要添加到 window 上
        window.addEventListener("deviceorientation", function (e) {
            var gamma = e.gamma;
            if (Math.abs(gamma) > 5) {
                _this.orientationFlag = true;
                _this.stage.style.transform = "rotateY(" + gamma * 1.5 + "deg)";
            }
            else {
                _this.orientationFlag = false;
            }
        });
    };
    return Scene;
}());
var stage = document.querySelector(".stage");
var audioEle = document.querySelector(".audio-bar");
var musicEle = document.querySelector(".music");
var picNum = 20;
new Scene({
    stage: stage,
    audioEle: audioEle,
    musicEle: musicEle,
    picNum: 20,
    picsTotalWidth: 2580
});
