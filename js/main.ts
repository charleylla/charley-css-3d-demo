interface PicSetting{
    stage:HTMLElement;
    audioEle:HTMLElement;
    musicEle:HTMLAudioElement;
    picNum:number;
    picsTotalWidth:number;
}

class Scene{
    stage:HTMLElement;
    audioEle:HTMLElement;
    musicEle:HTMLAudioElement;    
    picNum:number;
    picsTotalWidth:number;
    singlePicWidth:number;
    startPos:number;
    xOffset:number = 0;
    orientationFlag:boolean;
    constructor(option:PicSetting){
        const {
            stage,
            audioEle,
            musicEle,
            picNum,
            picsTotalWidth,
        } = option;
        this.stage = stage;
        this.audioEle = audioEle;
        this.musicEle = musicEle;
        this.picNum = picNum;
        this.picsTotalWidth = picsTotalWidth;
        this.singlePicWidth = picsTotalWidth / picNum;
        this.init();
    }

    init(){
        this.insertPics();
        this.bindAudioEvent();
        this.bindTouchEvent();
        this.bindDeviceorientationEvent();
    }

    insertPics(){
        const picRadius = this.getPicRadius();
        for(let i = 1; i < this.picNum + 1; i ++){
            const tmpDiv:HTMLElement = document.createElement("div");
            const backgroundUrl:string = `url("img/p${i}.png") no-repeat center center`;
            const transformDeg = `rotateY(${360 * i / this.picNum}deg) translateZ(${picRadius / 16}rem)`;
            tmpDiv.style.background = backgroundUrl;
            tmpDiv.style.transform = transformDeg;
            this.stage.appendChild(tmpDiv);
        }
    }

    getPicRadius():number{
        return Math.round(this.singlePicWidth / (2 * Math.tan(Math.PI / this.picNum))) - 3;
    }

    bindAudioEvent(){
        this.audioEle.addEventListener("touchend",()=>{
            if(this.musicEle.paused){
                this.audioEle.innerHTML = "🎺"
                this.musicEle.play();
            }else{
                this.audioEle.innerHTML = "⏸"
                this.musicEle.pause();
            }
        })
    }

    bindTouchEvent(){
        this.stage.addEventListener("touchstart",(e) => {
            e.preventDefault();
            const touch = e.targetTouches[0];
            // 获取开始触摸点
            // 第二次触摸时,使用更新后的 xOffset
            /**
             * 这样做的原因是:触摸点在屏幕上的横向范围只是屏幕的宽度
             * 但是 3D 空间的长度是大于屏幕的宽度的
             * 如果在经过旋转后,下次旋转还是使用屏幕上绝对的位置,那么会导致屏幕闪动
             * 因此需要在旋转时同步记录偏移距离,下次触摸时减去该距离
             */
            this.startPos = touch.pageX - this.xOffset;
        });

        this.stage.addEventListener("touchmove",(e) => {
            e.preventDefault();
            if(this.orientationFlag){
                return;
            }
            const touch = e.targetTouches[0];
            const pos = touch.pageX;
            // offset 是偏移距离,在手指移动后需要得到更新
            this.xOffset = pos - this.startPos;
            this.stage.style.transform = `rotateY(${this.xOffset}deg)`;
        });
    }

    bindDeviceorientationEvent(){
        // 该事件需要添加到 window 上
        window.addEventListener("deviceorientation",(e)=>{
            const gamma = e.gamma;
            if(Math.abs(gamma) > 5){
                this.orientationFlag = true;
                this.stage.style.transform = `rotateY(${gamma * 1.5}deg)`;
            }else{
                this.orientationFlag = false;
            }
        })
    }
}

const stage:HTMLElement = document.querySelector(".stage");
const audioEle:HTMLElement = document.querySelector(".audio-bar")
const musicEle:HTMLAudioElement = document.querySelector(".music");
const picNum = 20;
new Scene({
    stage,
    audioEle,
    musicEle,
    picNum:20,
    picsTotalWidth:2580,
});