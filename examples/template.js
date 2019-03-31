
document.body.innerHTML = `
  <!-- MagJS perf-->
  <div id="magjsapp">
    MagJS:
    <results></results>
    <div>
      <span class="magjsdata"><span></span></span>
    </div>
  </div>
  <!-- MagJS perf-->
  <hr/>

  <!-- DASHBOARD -->
  <div id="dashboard">
    <div id="filter-users">
      <h3>Filter users (<span data-bind="selectedUser"><name></name></span>)</h3>
      <input name="term" placeholder="Filter users by ... " />
      <ul>
        <li>Person Name: <span data-bind="name"></span>
        </li>
      </ul>
    </div>
    <div id="filter-projects">
      <h3>Filter projects (<span data-bind="selectedProject"><name></name></span>)</h3>
      <input name="term" placeholder="Filter projects by ... " />
      <ul>
        <li>Person Name: <span data-bind="name"></span>
        </li>
      </ul>
    </div>
  </div>
  <!-- DASHBOARD -->
  <hr/>

<!-- FILTER PRODUCTS -->
  <div id="filter-test">
    <h3>List filter example</h3>
    <input name="term" placeholder="Filter list by something" />
    <p>
      <label>
        <input name="inStockOnly" type="checkbox" /> <span class="checkable">Only show products in stock</span>
      </label>
      <ul>
        <li>Product Name: <span class="name"></span>
        </li>
      </ul>
  </div>
  <hr/>
  <!-- UNLOADER -->
  <div id="unloader">
    <mod></mod>
    <thing></thing>
    <button class="test">Unloader</button>
  </div>
  <div id="testmod" class="hide">
    YO
    <dude/>
  </div>
  <!-- UNLOADER -->
  <hr/>

  <!-- IN & OUT -->
  <div id="outside">
    <h2></h2>
    <h1></h1>
    <span><num></num></span>
    <button>CLick</button>
    <div id="inside">
      <h2></h2>
    </div>
  </div>
  <!-- IN & OUT -->




  <!-- TABS -->
  <div id="reactExampleGoesHere">

    <div class="countryList"></div>
    <div class="cityList"></div>

    <div class="template hide">
      <div id="TabList">
        <div class="list">
          <a></a>
        </div>
      </div>
    </div>
  </div>
  <!-- TABS -->
  <hr/>

  <div id="tabbed">
    <div>
      <ul>
        <li>
          <a href="#"></a>
        </li>
      </ul>
    </div>
    <div class="content"></div>
  </div>

  <!-- CLONES -->
  <b id="bbtest">TEST</b>
  <div id="demo">
    <h2>Boilerplate <span></span></h2>
    <cloner></cloner>
    <clone></clone>
    <div id="counter">
      <button>COUNTER
        <count/>
      </button>
    </div>
  </div>
  <!-- CLONES -->
  <hr/>

  <!-- SHOES -->
  <div id="shoes">
    <h3>Search shoes by color: <searching/></h3>
    <input name="searchText" placeholder="search for shoes.." />
    <ul>
      <li class="shoes">
        <span class="style"></span> -
        <color/>
        <div><a href="#">*</a>
        </div>
      </li>
    </ul>

  </div>
  <!-- SHOES -->
  <hr/>

  <!-- STARRED -->
  <div id="articles">
    <div data-bind="article">
      <star></star>
      <h2 data-bind="title"></h2>
    </div>
  </div>

  <div class="template hide">
    <div id="star"><span class="favorite-star-character">&#x2605;</span></div>
  </div>
  <!-- STARRED -->
  <hr/>


  <!-- DBMON -->

  <div id="dbmon">
    <div>
      <table className="table table-striped latest-data">
        <tbody>
          <!-- loop rows -->
          <tr data-bind="databases">
            <td class="dbname">
              {database.dbname}
            </td>
            <td class="query-count">
              <span class={database.lastSample.countClassName}>
                        {database.lastSample.nbQueries}
                      </span>
            </td>
            <td data-bind="samples" class="">
              {query.formatElapsed}
              <div class="popover left">
                <div class="popover-content">{query.query}</div>
                <div class="arrow"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <!-- DBMON -->
  <hr/>




  <!-- REPEATER -->
  <div id="repeater">
    <h1>Riot <button>Reverse</button> <timeTaken/></h1>
    <div>
      <span id="magjsappMountNode2"><h2 class="magjsdata">Line #<span class="num"></span></h2>
      </span>
    </div>
  </div>
  <!-- REPEATER -->
  <hr/>


  <!-- instances -->
  <div id="app35" class="hide">
    <input name="me">
    <thingy/>
    <h4 data-bind="me"></h4>
    <ul>
      <li></li>
    </ul>
    <test>HELLO!</test>
    -
    <b class="newer"></b>

    <div data-bind="inners">
      <div class="item"></div>
    </div>
  </div>

  <div class="hide template">
    <div id="inner35">
      <h3>World! </h3>
      <count></count>
    </div>
  </div>
  <!-- instances -->
  <hr/>
  <!-- CHANGER -->
  <div id="changer">
    <h2>TEST</h2>
    <data></data>
  </div>
  <div class="template hide">
    <div id="comp" class="">
      <h2 class="head">TESTER</h2>
      <b>b</b>
      <span>testerrr</span>
    </div>
  </div>
  <!-- CHANGER -->
  <hr/>



  <!-- LISTS -->
  <div id="lister">
    <h2>Hello <span></span></h2>
    <ul>
      <li class="item"></li>
    </ul>
  </div>

  <div id="lister2">
    <h2>Hello <span></span></h2>
    <ul>
      <li class="item"></li>
    </ul>
  </div>

  <div id="lister3">
    <h2>Hello <span></span></h2>
    <ul>
      <li class="item"></li>
    </ul>
  </div>
  <!-- LISTS -->
  <hr/>




  <!-- MODAL -->
  <div id="modalCase">
    <div id="modal" class="hide">
      <section class="modal">
        <section class="wrapper">
        </section>
        <button class="close-modal">Close</button>
      </section>
    </div>
    <button>Open</button>
  </div>
  <!-- MODAL -->
  <hr/>

  <!-- NAV MENU -->
  <div id="nav-menu">
    <h2>Navigation Menu</h2>
    <nav class=""><a href="#">Home</a></nav>
    <p class="activated-hide">Please click a menu item</p>
  </div>
  <!-- NAV MENU -->

  <!-- PRODUCT FILTER SEARCH -->


  <div class="template hide">
    <div id="ProductCategoryRow">
      <div class="row">
        <div class="row-header" colSpan="2">TEST</div>
      </div>
    </div>

    <div id="ProductRow" class="hide">
      <div class="row">
        <div class="row-cell name">NAME</div>
        <div class="row-cell price">PRICE</div>
      </div>
    </div>

    <div id="ProductTable">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  </div>
  <!-- PRODUCT FILTER SEARCH -->
  <hr/>

  <!-- SEARCH -->
  <div id="SearchExample">
    <h3>Real-time search</h3>
    <div>
      <input type="text" placeholder="Type here" />
      <ul>
        <li>{l.name} <a href={l.url}>{l.url}</a>
        </li>
      </ul>
    </div>
  </div>
  <!-- SEARCH -->
  <hr/>

  <!-- COUNT -->
  <div id="count">
    <button>Increment</button>
    count: <span class="count"></span>
  </div>
  <!-- COUNT -->
  <hr/>

  <!-- COUNT-BOTH -->
  <div id="count-both">
    <span>0</span>
    <div id="Toolbar">
      <button class="decrement">decrement</button>
      <button class="increment">increment</button>
    </div>
  </div>
  <!-- COUNT-BOTH -->
  <hr/>



  <!-- CONTACTS -->
  <div id="contacts" class="hide">
    <h2></h2>
    <div id="form">
      <input name="name" />
      <input name="email" />
      <button>Save</button>
    </div>
    <ul id="list" class="hide">
      <li class="contact">
        <span class="name"></span>
      </li>
    </ul>
  </div>
  <!-- CONTACTS -->
  <hr/>


  <!-- TODOS -->
  <div id="todo">
    <h2>Todo - example</h2>
    <div id="totaly">
      <div class="total">
        <b class="remaining"></b>
        <span class="size"></span>
        <a href="#">[archive]</a>
      </div>
    </div>

    <div class="list">
      <div class="todoList">
        <input name="done" type="checkbox" value="thingy" />
        <span class="checkable" data-bind="todoText"></span>
      </div>
    </div>

    <form>
      <input name="todoInput" placeholder="Add New" />
      <input type="submit" name="add" value="Add New" />
    </form>
  </div>
  <!-- TODOS -->
  <hr/>




  <!-- Messaging -->
  <div id="Messaging">
    <h2>Messaging <total></total></h2>
    <button class="default">Show default message</button>
    <button class="success">Show success message</button>
    <button class="error">Show error message</button>
    <div id="inmessaging">
      <div class="messages">
        <div class="message-item">
        </div>
      </div>
    </div>
    <div id="message">
      <div><i></i> <span></span>
      </div>
    </div>
  </div>
  <!-- Messaging -->
  <hr/>


  <!-- COMMENTS -->


  <div id="CommentBox">
    <h1>Comments</h1>
    <div id="CommentList">
      <div class="comment">
      </div>
    </div>
    <div class="template hide">
      <div id="Comment">
        <h2 class="commentAuthor">
        </h2>
        <span></span>
      </div>
    </div>
  </div>
  <!-- COMMENTS -->

  <hr/>


  <!-- FORM -->

  <div id="former">
    <div id="lister4">
      <ul>
        <li></li>
      </ul>
    </div>
    <form id="saver">
      <input>
      <button>Save</button>
    </form>
  </div>
  <!-- FORM -->

  <hr/>

  <!-- TODOS-SIMPLE-->
  <div id="todos-simple">
    <span></span>
    <input>
    <button>Add</button>
    <ol>
      <li class="list">
        <label class="checkbox">
          <input class="check" type="checkbox" />
          <span class="description"></span>
        </label>
      </li>
    </ol>
  </div>

  <!-- TODOS-SIMPLE-->



  <hr/>
  <!-- ASYNC -->

  <div id="async">
    <button>click</button>
    <span class="test">default</span>
    <span class="name"></span>
    <div id="passFail2" class="hide">
      <div class="messaging"></div>
    </div>
    <b>default</b>
  </div>

  <!-- ASYNC -->
  <hr/>



  <!-- Math -->
  <div id="mathdemo">
    <form onsubmit="return false">
      1st Number :
      <input type="text" name="num1" />
      <br/> 2nd Number :
      <input type="text" name="num2" />
      <button>ADD</button>
      <br/> Sum :
      <result></result>
    </form>
  </div>
  <hr/>

  <div id="mathdemo1">
    1st Number :
    <input type="text" name="num1">
    <br/> 2nd Number :
    <input type="text" name="num2">
    <button>ADD</button>
    <br/> Sum :
    <result></result>
  </div>
  <hr/>
  <div id="mathdemo2">
    <numbers>
      1st Number :
      <input type="text" name="num1">
      <br/> 2nd Number :
      <input type="text" name="num2">
    </numbers>
    <button>ADD</button>
    <br/> Sum :
    <result></result>
  </div>
  <hr/>

  <!-- MATH -->
  <div id="mathdemo3">
    <h2>Simple addition</h2>
    <div class="numbers">
      1st number :
      <input name="num1"> 2nd number :
      <input name="num2">

      <button>ADD</button>
      <br/>
      <num1></num1> +
      <num2></num2> = Sum :
      <result></result>
    </div>
  </div>
  <!-- MATH -->
  <hr/>


  <div id="mathdemo4">
    <h2>Simple addition 3</h2>
    <div class="numbers">
      1st number :
      <input name="num1"> 2nd number :
      <input name="num2">
      <div class="nested">
        <select name="test">
          <option></option>
        </select>
      </div>
      <button>ADD</button>
      <br/>
      <num1></num1> +
      <num2></num2> = Sum :
      <result></result>
    </div>
  </div>

  <hr/>

  <div id="mathdemo5">
    inner component
    <div id="mathdemo6">
      <input name="author" type="text" placeholder="Your name" />
      <input name="text" type="text" placeholder="Say something..." />
      <input class="add" type="submit" value="Post" />
    </div>
    <br/> Sum :
    <result></result>
  </div>

  <!-- Math -->

  <hr/>


  <div id="app2">
    <test>HELLO!</test><b class="newer"></b></div>


  <hr/>
  <!-- TIMER -->

  <main id="timer">
    <h3>Timer</h3>
    <p>This example was started <b><seconds></seconds> seconds</b> ago.</p>
  </main>
  <hr/>

  <!-- TIMER -->
  <hr/>


  <!-- BUILD -->
  <div id="test24">
    <h2></h2>
    <p><b></b></p>
  </div>
  <hr/>


  <div id="test" class="hide">
    <button>click</button>
    <span class="test">default</span>
    <span class="name"></span>
    <div id="passFail2" class="hide">
      <div class="messaging"></div>
    </div>
    <b>default</b>
    <div id="build">
      <textarea></textarea>
      <a href="">Nested - module - build</a>
      <div class="more"></div>
    </div>
  </div>
  <!-- BUILD -->
  <hr/>

  <!-- FORM TEST -->
  <main id="form-test">
    <h1>Say </h1>
    <input placeholder="test" value='tester' />


    <select>
      <option value="1">1</option>
      <option value="2">2</option>
    </select>
    <textarea></textarea>
    <button>Do</button>
    <div>
      <div class="item">
        <input type="checkbox" name="done" value="thingy" />
        <span></span>
      </div>
    </div>
  </main>

  <div id="innerhello"><b></b>
  </div>
  FORM TEST
  <hr/>
  
   <div id="main">

    <h2>Navigation Menu</h2>
    <nav class="">
      <a href="#">Home</a>
    </nav>
    <p class="activated-hide">Please click a menu item</p>
  </div>
  
  
    <main id="hello">
    <h1>Say </h1>
    <input placeholder="test" value='tester' />


    <select>
      <option value="1">1</option>
      <option value="2">2</option>
    </select>
    <textarea></textarea>
    <button>Do</button>
    <div>
      <div class="item">
        <input type="checkbox" name="done" value="thingy" />
        <span></span>
      </div>
    </div>
  </main>
  
    <div id="app">
    <h2>TEST</h2>
    <data></data>
  </div>
`