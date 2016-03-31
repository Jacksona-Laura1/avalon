var expect = chai.expect
function heredoc(fn) {
    return fn.toString().replace(/^[^\/]+\/\*!?\s?/, '').
            replace(/\*\/[^\/]+$/, '').trim().replace(/>\s*</g, '><')
}


describe('widget', function () {
    var body = document.body, div, vm
    beforeEach(function () {
        div = document.createElement('div')
        body.appendChild(div)
    })


    afterEach(function () {
        body.removeChild(div)
        delete avalon.vmodels[vm.$id]
    })
    it('inline-block', function (done) {
        div.innerHTML = heredoc(function () {
            /*
             <div ms-controller='widget0' >
             <xmp ms-widget="{is:'ms-button'}">{{@btn}}</xmp>
             <ms-button>这是标签里面的TEXT</ms-button>
             <ms-button ms-widget='{buttonText:"这是属性中的TEXT"}'></ms-button>
             <ms-button></ms-button>
             </div>
             */
        })
        vm = avalon.define({
            $id: 'widget0',
            btn: '这是VM中的TEXT'
        })
        avalon.scan(div)
        setTimeout(function () {
            var span = div.getElementsByTagName('span')
            expect(span[0].innerHTML).to.equal('这是VM中的TEXT')
            expect(span[1].innerHTML).to.equal('这是标签里面的TEXT')
            expect(span[2].innerHTML).to.equal('这是属性中的TEXT')
            expect(span[3].innerHTML).to.equal('button')
            vm.btn = '改动'
            setTimeout(function () {
                expect(span[0].innerHTML).to.equal('改动')

                done()
            })
        })


    })

    it('lifecycle', function (done) {
        div.innerHTML = heredoc(function () {
            /*
             <div ms-controller='widget1' >
             <div><wbr ms-widget="[{is:'ms-button'},@config]"/></div>
             </div>
             */
        })
        var index = 0
        vm = avalon.define({
            $id: 'widget1',
            config: {
                buttonText: '按钮',
                onInit: function (e) {
                    expect(e.type).to.equal('init')
                    ++index
                },
                onReady: function (e) {
                    expect(e.type).to.equal('ready')
                    ++index
                },
                onViewChange: function (e) {
                    expect(e.type).to.equal('viewchange')
                    ++index
                },
                onDispose: function (e) {
                    expect(e.type).to.equal('dispose')
                    ++index
                }
            }
        })
        avalon.scan(div)
        setTimeout(function () {
            expect(index).to.equal(2)
            vm.config.buttonText = 'change'
            setTimeout(function () {
                div.innerHTML = ""
                setTimeout(function () {
                    expect(index).to.equal(4)
                    done()
                })
            })
        })
    })

})