import mag from "../../src/mag"
import {MAGNUM} from "../../src/core/constants"

beforeEach(() => {
    document.body.innerHTML = "<div id='root'></div>"
})

test("simple array map", () => {


    var App = mag('<ul><li></li></ul>', function () {
        return {li: [1, 2]}
    })

    mag(App(), "root")
    expect(document.querySelectorAll('#root li').length).toEqual(2)
    expect(document.querySelectorAll('#root li')[0].textContent).toEqual("1")
    expect(document.querySelectorAll('#root li')[1].textContent).toEqual("2")
})

test("simple array no map frag", () => {


    var App = mag('<li></li><li></li>', function () {
        return [1, 2]
    })

    mag(App(), "root")
    expect(document.querySelectorAll('#root li').length).toEqual(2)
    expect(document.querySelectorAll('#root li')[0].textContent).toEqual("1")
    expect(document.querySelectorAll('#root li')[1].textContent).toEqual("")
})


test("simple array no map", () => {


    var App = mag('<li></li>', function () {
        return [1, 2]
    })

    mag(App(), "root")
    expect(document.querySelectorAll('#root li').length).toEqual(1)
    expect(document.querySelector('#root li').textContent).toEqual("1")
})

test("simple array with comps", () => {


    var Li = mag('<li></li>', function (props) {
        return props.number
    })


    var Ul = mag('<ul></ul>', function (props) {
        return props.numbers.map((number,key) => Li({number, key}))
    })

    mag(Ul({numbers: [1,2,3]}), "root")

    expect(document.querySelectorAll('#root ul li').length).toEqual(3)
})


test("return array no mapping", () => {

    var App = mag(`<ol></ol>`, ()=>[])

    mag(App(), "root")

    expect(document.querySelector('#root').textContent).toEqual("")
})

test("return array no mapping", () => {

    var App = mag(`<ol></ol>`, ()=>([]))

    mag(App(), "root")

    expect(document.querySelector('#root').textContent).toEqual("")
})

test("return array no mapping one array item", () => {

    var App = mag(`<ol></ol>`, ()=>([1]))

    mag(App(), "root")

    expect(document.querySelector('#root').textContent).toEqual("1")
})

test("return array no mapping two array items", () => {

    var App = mag(`<ol></ol>`, ()=>[1,2])

    mag(App(), "root")

    expect(document.querySelector('#root').innerHTML).toEqual("<ol>1</ol>")
})

test("return array no mapping sub element with array val", () => {

    var App = mag(`<ol><li></li></ol>`, ()=>({li:[1,2,3]}))

    mag(App(), "root")

    expect(document.querySelector('#root').textContent).toEqual("123")
})

test("return array no mapping sub comp", () => {


    var Sub = mag(`<li></li>`,()=>[1,2])

    var App = mag(`<ol></ol>`, ()=>Sub())

    mag(App(), "root")

    expect(document.querySelector('#root').innerHTML).toEqual("<ol><li>1</li></ol>")
})

test("return array no mapping sub comp as arrays", () => {


    var Sub = mag(`<li></li>`,({key})=>key)

    var App = mag(`<ol />`, ()=>[Sub({key: 1}), Sub({key: 2})])

    mag(App(), "root")

    expect(document.querySelector('#root').innerHTML).toEqual("<ol><li>1</li><li>2</li></ol>")
})

test("return array no mapping sub comp as arrays with same values", () => {


    var Sub = mag(`<li></li>`,()=>1)

    var App = mag(`<ol />`, ()=>[Sub({key: 1}), Sub({key: 2})])

    mag(App(), "root")

    expect(document.querySelector('#root').innerHTML).toEqual("<ol><li>1</li><li>1</li></ol>")
})

test("return array no mapping sub comp", () => {


    var Sub = mag(`<li></li><li></li>`,()=>1)

    var App = mag(`<ol></ol>`, ()=>Sub())

    mag(App(), "root")

    expect(document.querySelector('#root').innerHTML).toEqual("<ol><li>1</li><li></li></ol>")
})