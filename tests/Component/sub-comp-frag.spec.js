import mag from "../../src/mag"


test("sub comp re-rendering with out fragment return string", () => {


    var Sub = mag(`<i>TEST</i>`, function(){
        return  "tester"
    })
    var App = mag(
        '<div><h1>B</h1><h2>CLICKER</h2></div>',
        function(props){
            return {
                h1: props.hide?"YO":Sub(),
                h2: { onclick: e => App({hide: !props.hide})}
            }
        })

    mag(App(),document.body)

    expect(document.querySelector('h1 i').textContent).toEqual("tester")
    document.querySelector('h2').click()
    expect(document.querySelector('h1').textContent).toEqual("YO")
    document.querySelector('h2').click()
    expect(document.querySelector('h1 i').textContent).toEqual("tester")
})

test("sub comp re-rendering with out fragment return html string", () => {


    var Sub = mag(`<i>TEST</i>`, function(){
        return  "<span>tester</span>"
    })
    var App = mag(
        '<div><h1>B</h1><h2>CLICKER</h2></div>',
        function(props){
            return {
                h1: props.hide?"YO":Sub(),
                h2: { onclick: e => App({hide: !props.hide})}
            }
        })

    mag(App(),document.body)

    expect(document.querySelector('h1 i').textContent).toEqual("tester")
    document.querySelector('h2').click()
    expect(document.querySelector('h1').textContent).toEqual("YO")
    document.querySelector('h2').click()
    expect(document.querySelector('h1 i').textContent).toEqual("tester")
})

test("sub comp re-rendering with out fragment _html", () => {


    var Sub = mag(`<i>TEST</i>`, function(){
        return {_html: "tester"}
    })
    var App = mag(
        '<div><h1>B</h1><h2>CLICKER</h2></div>',
        function(props){
            return {
                h1: props.hide?"YO":Sub(),
                h2: { onclick: e => App({hide: !props.hide})}
            }
        })

    mag(App(),document.body)

    expect(document.querySelector('h1 i').textContent).toEqual("tester")
    document.querySelector('h2').click()
    expect(document.querySelector('h1').textContent).toEqual("YO")
    document.querySelector('h2').click()
    expect(document.querySelector('h1 i').textContent).toEqual("tester")
})

test("sub comp re-rendering with out fragment _text", () => {


    var Sub = mag(`<i>TEST</i>`, function(){
        return {_text: "tester"}
    })
    var App = mag(
        '<div><h1>B</h1><h2>CLICKER</h2></div>',
        function(props){
            return {
                h1: props.hide?"YO":Sub(),
                h2: { onclick: e => App({hide: !props.hide})}
            }
        })

    mag(App(),document.body)

    expect(document.querySelector('h1 i').textContent).toEqual("tester")
    document.querySelector('h2').click()
    expect(document.querySelector('h1').textContent).toEqual("YO")
    document.querySelector('h2').click()
    expect(document.querySelector('h1 i').textContent).toEqual("tester")
})

test("sub comp re-rendering with fragment and _text", () => {


    var Sub = mag(`<i>TEST</i>`, function(){
        return {_text: "tester"}
    })
    var App = mag(
        '<h1>B</h1><h2>CLICKER</h2>',
        function(props){
            return {
                h1: props.hide?"YO":Sub(),
                h2: { onclick: e => App({hide: !props.hide})}
            }
        })

    mag(App(),document.body)

    expect(document.querySelector('h1 i').textContent).toEqual("tester")
    document.querySelector('h2').click()
    expect(document.querySelector('h1').textContent).toEqual("YO")
    document.querySelector('h2').click()
    expect(document.querySelector('h1 i').textContent).toEqual("tester")
})

test("sub comp re-rendering with fragment and _html", () => {


    var Sub = mag(`<i>TEST</i>`, function(){
        return {_html: "tester"}
    })
    var App = mag(
        '<h1>B</h1><h2>CLICKER</h2>',
        function(props){
            return {
                h1: props.hide?"YO":Sub(),
                h2: { onclick: e => App({hide: !props.hide})}
            }
        })

    mag(App(),document.body)

    expect(document.querySelector('h1 i').textContent).toEqual("tester")
    document.querySelector('h2').click()
    expect(document.querySelector('h1').textContent).toEqual("YO")
    document.querySelector('h2').click()
    expect(document.querySelector('h1 i').textContent).toEqual("tester")
})