import mag from "../../src/mag"
import "../../src/hookins/mag.useState"


beforeEach(() => {
    document.body.innerHTML = "<div id='root'></div>"
})


test("tagged func with sub prop", ()=>{
    mag.App = {}
    mag.App.Sub = mag('<p><num1></num1><num2/><num3 >', props=>props)
    mag(
        mag`<App.Sub num1=${1} num2=2  num3="33.23"/>`,
        'root'
    )
    expect(document.querySelector('#root').innerHTML).toEqual("<fragment>\n<p><num1>1</num1><num2>2</num2><num3>33.23</num3></p>\n</fragment>")
})

test("tagged func with sub prop child", ()=>{
    mag.Test = mag('<b>', ()=>{})
    mag.Test.SubCut = mag('<i>', ()=>{})
    mag.App = {}
    mag.App.Sub = mag('<p><children/><num1></num1><num2/><num3 >', props=>props)
    mag(
        mag`<App.Sub num1=${1} num2=2  num3="33.23"><Test.SubCut/></App.Sub>`,
        'root'
    )
    expect(document.querySelector('#root').innerHTML).toEqual("<fragment>\n<p><children><i></i></children><num1>1</num1><num2>2</num2><num3>33.23</num3></p>\n</fragment>")
})

test("tagged func with sub prop", ()=>{
    mag.App = mag('<p>', ()=>{})
    mag.App.Sub = mag('<p><num1></num1><num2/><num3 >', props=>props)
    mag(
        mag`<App.Sub num1=${1} num2=2  num3="33.23"/>`,
        'root'
    )
    expect(document.querySelector('#root').innerHTML).toEqual("<fragment>\n<p><num1>1</num1><num2>2</num2><num3>33.23</num3></p>\n</fragment>")
})

test("tagged number attr", ()=>{

    mag.App = mag('<p><num1></num1><num2/><num3 >', props=>props)
    mag(
        mag`<App num1=${1} num2=2  num3="33.23"/>`,
        'root'
    )
    expect(document.querySelector('#root').innerHTML).toEqual("<fragment>\n<p><num1>1</num1><num2>2</num2><num3>33.23</num3></p>\n</fragment>")
})


test("render props", ()=>{

    mag.Foo = (props) => {


        ({ render: mag.View } = props)

        return mag`<View name="foo" />`
    };

    const Hello = ({ name }) => {
        return `<div>hello from ${name}</div>`
    };


    mag(
        mag`<Foo render=${Hello} />`,
        'root'
    )

    expect(document.querySelector('#root').innerHTML).toEqual("<fragment>\n<fragment>\n<fragment>\n<div>hello from foo</div>\n</fragment>\n</fragment>\n</fragment>")

})

test("child as func returns string of html", () =>{
    mag.Foo = ({ children }) => {
        return children('foo')
    };

    var handler = name => `<div>hello from ${name}</div>`

    mag(
        mag`<Foo>${handler}</Foo>`,
        'root'
    )
    expect(document.querySelector('#root').innerHTML).toEqual("<fragment>\n<fragment>\n<div>hello from foo</div>\n</fragment>\n</fragment>")

})

test("child as func", ()=>{


    mag.Sub = mag('<b>', props => {
        return props.children("test")
    })


    mag(
        mag`
    <Sub>${(name) => `
            <div>${name}</div>
            `}
    </Sub>
    `,
        'root'
    )

    expect(document.querySelector('#root').innerHTML).toEqual("<fragment>\n<b><div>test</div></b>\n</fragment>")
})

test("child as func white space", ()=>{


    mag.Sub = mag('<b>', props => {
        return props.children("test")
    })


    mag(
        mag`
    <Sub>
        ${(name) => `
            <div>${name}</div>
            `}
    </Sub>
    `,
        'root'
    )

    expect(document.querySelector('#root').innerHTML).toEqual("<fragment>\n<b><div>test</div></b>\n</fragment>")
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
            onclick:e=> handler(num+ 1)
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
