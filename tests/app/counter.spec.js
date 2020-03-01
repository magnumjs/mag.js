import mag from "../../src/mag"
import "../../src/hookins/mag.useState"


beforeEach(() => {
    document.body.innerHTML = "<div id='root'></div>"
})



test("render props", ()=>{

    mag.Foo = ({ render: View }) => {
        mag.View = View
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
            `}</Sub>
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
