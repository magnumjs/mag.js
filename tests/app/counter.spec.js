import mag from "../../src/mag"
import "../../src/hookins/mag.useState"


beforeEach(() => {
    document.body.innerHTML = "<div id='root'></div>"
})


test("tagged names case insensitive", () => {

    mag.sub = mag('<b>', ()=>[])

    mag(mag`<SuB/>`, "root")

    expect(document.querySelector('#root').innerHTML).toEqual("<fragment>\n<b></b>\n</fragment>")
})

test("counter function pass as attribute", ()=>{
    mag.Counter=mag('<num/><button>couch me',
        ({num, handler, test})=>{

        return {
            num,
            onclick:e=> handler(++num)
        }
    })

    var app=mag('root', props=>{
        const [num, setNum] = mag.useState(props.num)

        function handle(val) {
            setNum(val)
        }


        var obj = [1,2,3]
        return mag`
            <Counter handler=${handle} num=${num} test=${obj} />
        `
    })

    app({num: 0})

    expect(document.querySelector('#root').innerHTML).toEqual("\n<fragment><num>0</num><button>couch me</button></fragment>\n")
    document.querySelector('#root button').click()
    expect(document.querySelector('#root').innerHTML).toEqual("\n<fragment><num>1</num><button>couch me</button></fragment>\n")
    document.querySelector('#root button').click()
    expect(document.querySelector('#root').innerHTML).toEqual("\n<fragment><num>2</num><button>couch me</button></fragment>\n")
})
