import {createVue, destroyVM, timeoutPromise} from "../util";
import {ISnAudioRef} from "../../../src/types/audio";

describe('Audio', () => {
    let vm;
    afterEach(() => {
        console.log("单个测试用例完成");
        destroyVM(vm);
    });
    it('create', done => {
        vm = createVue({
            template: `
            <div>
                <p>加载声音控件</p>
                <sn-audio
                    ref="audio"
                    :play-once-use-time="singleTime"
                    :setting-seconds="totalTime"
                    :music-url="musicUrl"
                >
                </sn-audio>
            </div>
          `,
            data() {
                return {
                    musicUrl: "/music/alarm.mp3",
                    totalTime: 12,
                    singleTime: 3
                }
            },
            methods: {
                getAudioRef() {
                    return this.$refs['audio'] as ISnAudioRef;
                }
            }
        }, true);
        let elm = vm.$el;
        let audioRef = vm.$refs['audio'];
        test();

        async function test(){
            await timeoutPromise(()=>{
                expect(audioRef.playOnceUseTime).to.be.equal(vm.singleTime);
                expect(audioRef.settingSeconds).to.be.equal(vm.totalTime);
                expect(audioRef.musicUrl).to.be.equal(vm.musicUrl);
                expect(audioRef.playOnceUseTime).to.be.not.equal(2.5);
                expect(audioRef.settingSeconds).to.be.not.equal(10);
                expect(audioRef.musicUrl).to.be.not.equal('www.baidu.com');
                expect(audioRef.$refs['audioDom'].querySelector("source").src).to.be.not.equal(vm.musicUrl);
            }, 500);
            await timeoutPromise(()=>{
                done();
            }, 500)
        }
    });

    it('play-audio', done => {
        vm = createVue({
            template: `
            <div>
                <p>加载声音控件</p>
                <sn-audio
                    ref="audio"
                    :play-once-use-time="singleTime"
                    :setting-seconds="totalTime"
                    :music-url="musicUrl"
                >
                </sn-audio>
            </div>
          `,
            data() {
                return {
                    musicUrl: "/music/alarm.mp3",
                    totalTime: 3,
                    singleTime: 3
                }
            },
            methods: {
                getAudioRef() {
                    return this.$refs['audio'] as ISnAudioRef;
                }
            }
        });
        let elm = vm.$el;
        let audioRef = vm.$refs['audio'];
        test();

        async function test(){
            await timeoutPromise(()=>{
                audioRef.play();
            }, 500);
            await timeoutPromise(()=>{
                console.log(audioRef.$refs['audioDom']);
            }, 300);
            await timeoutPromise(()=>{
                expect(audioRef.$refs['audioDom'].ended).to.be.equal(true);
                done();
            }, 8000)
        }
    });
});
