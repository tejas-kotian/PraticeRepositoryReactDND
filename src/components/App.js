import React, { Component } from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import styled from "styled-components";

import GifSwatch from "./GifSwatch";
import GifDropzone from "./GifDropzone";
import urls from "../constants/urls";
//import mockResponse from '../constants/mockResponse';
import logoUrl from "../logo.svg";
import GiphyApi from "../api/giphyapi";
import {
  applyFilter,
  resolveFilter,
  Filters,
  setPlaceHolderResult
} from "../common/util";
import toastr from "toastr";

const sidebarWidth = 300;
const StyledAppContainer = styled.div`
  .masthead {
    background: #eee;
  }

  .content-container {
    position: relative;
    //padding-left: ${sidebarWidth}px;
  }

  .main {
    position: relative;
    float: left;
    width: 100%;
    //background: #989898;
    min-height: 400px;
    // Just demonstrating how you can set a background image to a relative asset
  //  background-image: url('${logoUrl}');
  }

  .footer {
    text-align: center;
    padding: 12px 0;
    background: #f4f4f4;
  }

  .dropzone {
    min-height: 200px;
  }

  .search-input{
  -moz-border-radius: 15px;
 border-radius: 15px;
    border:solid 1px black;
    padding:5px;
    margin :10px;
  },

  * {
    box-sizing: border-box;
  }
  
  .row {
    display: -ms-flexbox; /* IE 10 */
    display: flex;
    -ms-flex-wrap: wrap; /* IE 10 */
    flex-wrap: wrap;
    padding: 0 4px;
  }
  
  /* Create two equal columns that sits next to each other */
  .column {
    -ms-flex: 50%; /* IE 10 */
    flex: 50%;
    padding: 0 4px;
  }
  
  
  .scrolling-wrapper-flexbox {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;

    .card {
      flex: 0 0 auto;
    }
  }  
  .slider {
  width: auto;
  height: 100%;
  display: flex;
  overflow-x: auto;
  margin-top: 7px;
}
.slide {
  width: auto;
  flex-shrink: 0;
  height: 99%;
  margin-right:10px;
}
#overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 2;
  cursor: pointer;
}
  
`;

class App extends Component {
  constructor() {
    super();
    this.state = {
      placeholderResult: {},
      placeholder1: {
        url:
          "https://media2.giphy.com/media/7PhtBb0dmmoRW/200.gif?cid=e1bb72ff5c7d444c624a616849d9884b",
        id: "7PhtBb0dmmoRW",
        details: {
          title: "aul rudd coldplay GIF",
          username: "dummy1",
          source: "site"
        }
      },
      placeholder2: {
        url:
          "https://media0.giphy.com/media/GJhuSjRUPw4co/giphy.gif?cid=e1bb72ff5c7d444c624a616849d9884b",
        id: "GJhuSjRUPw4co",
        details: {
          title: "aul rudd coldplay GIF",
          username: "dummy1",
          source: "site"
        }
      },
      placeholder3: {
        url:
          "https://media2.giphy.com/media/sjCMt7gtx0Muc/giphy.gif?cid=e1bb72ff5c7d444c624a616849d9884b",
        id: "sjCMt7gtx0Muc",
        details: {
          title: "aul rudd coldplay GIF",
          username: "dummy1",
          source: "site"
        }
      },
      placeholder4: {
        url:
          "https://media0.giphy.com/media/sh3y88tgOINC8/giphy.gif?cid=e1bb72ff5c7fe1a2696562466709eb78",
        id: "sh3y88tgOINC8",
        details: {
          title: "aul rudd coldplay GIF",
          username: "dummy1",
          source: "site"
        }
      },
      limit: 25,
      offset: 0,
      filter: Filters.ALL,
      dimension: "Original",
      textSearch: "",
      result: {},
      isLoading: false
    };
    this.onDrop = this.onDrop.bind(this);
    this.onLimitChange = this.onLimitChange.bind(this);
    this.onScrollChange = this.onScrollChange.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onShowInfo = this.onShowInfo.bind(this);
    this.getImagesByID = this.getImagesByID.bind(this);
  }

  renderSwatch(r) {
    const props = {
      key: r.id,
      id: r.id,
      thumbnailUrl: r.images.fixed_height_small_still.url
    };
    return (
      <GifSwatch {...props} handleDrop={id => this.deleteItem(props.id)} />
    );
  }

  onShowInfo(_obj) {
    let _id = _obj.target.id;
    let obj = this.state[_id];
    let _msg = `Title is ${obj.details.title} and source is ${
      obj.details.source
    }.User for this image is ${obj.details.username}`;
    toastr["info"]("Details", _msg);
  }

  onScrollChange(obj) {
    let _half = (obj.target.scrollWidth * 99) / 100;
    _half =
      _half !== undefined && _half !== null && _half !== 0
        ? _half
        : Number.MAX_VALUE;
    let _limit = this.state.limit;
    let _offset = this.state.offset;
    if (
      obj.target.offsetWidth + obj.target.scrollLeft >= _half ||
      obj.target.id === "Next"
    ) {
      this.setState({ isLoading: true });

      GiphyApi.getImages(_offset, _limit, this.state.textSearch)
        .then(response => response.json())
        .then(data => {
          this.setState({
            offset: data.pagination.offset + _limit,
            result: data,
            isLoading: false
          });
        })
        .catch(error => {
          toastr.error(error);
          this.setState({ error, isLoading: false });
        });
    } else if (
      (obj.target.scrollLeft <= 10 && this.state.offset !== 0) ||
      obj.target.id === "Previous"
    ) {
      this.setState({ isLoading: true });
      GiphyApi.getImages(_offset - _limit, _limit, this.state.textSearch)
        .then(response => response.json())
        .then(data => {
          this.setState({
            offset: data.pagination.offset,
            result: data,
            isLoading: false
          });

          toastr.success("Processing Next Page");
        })
        .catch(error => {
          toastr.error(error);
          this.setState({ error, isLoading: false });
        });
    }
  }

  onFilter(obj) {
    this.setState({ dimension: obj.target.value });

    let _property = resolveFilter(obj.target.value);

    if (_property === "filters") {
      this.setState({ filter: obj.target.value });
      return;
    }

    let _result = this.state.result;
    let _placeHolder1, _placeHolder2, _placeHolder3, _placeHolder4;

    if (_result.data != null) {
      _placeHolder1 = setPlaceHolderResult(
        _result,
        this.state.placeholder1.id,
        this.state.placeholderResult
      );
      _placeHolder2 = setPlaceHolderResult(
        _result,
        this.state.placeholder2.id,
        this.state.placeholderResult
      );
      _placeHolder3 = setPlaceHolderResult(
        _result,
        this.state.placeholder3.id,
        this.state.placeholderResult
      );
      _placeHolder4 = setPlaceHolderResult(
        _result,
        this.state.placeholder4.id,
        this.state.placeholderResult
      );

      this.setState({
        placeholder1: {
          id: _placeHolder1.id,
          url: _placeHolder1.images[_property].url,
          details: {
            title: _placeHolder1.title,
            username: _placeHolder1.username,
            source: _placeHolder1.source
          }
        },
        placeholder2: {
          id: _placeHolder2.id,
          url: _placeHolder2.images[_property].url,
          details: {
            title: _placeHolder2.title,
            username: _placeHolder2.username,
            source: _placeHolder2.source
          }
        },
        placeholder3: {
          id: _placeHolder3.id,
          url: _placeHolder3.images[_property].url,
          details: {
            title: _placeHolder3.title,
            username: _placeHolder3.username,
            source: _placeHolder3.source
          }
        },
        placeholder4: {
          id: _placeHolder4.id,
          url: _placeHolder4.images[_property].url,
          details: {
            title: _placeHolder4.title,
            username: _placeHolder4.username,
            source: _placeHolder4.source
          }
        }
      });
    }
  }

  getImagesByID() {
    let result = this.state.result;
    let _result = {};
    _result.data = [];
    let _ids = [];
    ["placeholder1", "placeholder2", "placeholder3", "placeholder4"].map(a => {
      let _findObj = result.data.find(x => x.id === this.state[a].id);
      if (_findObj === undefined) {
        _ids.push(this.state[a].id);
      } else {
        _result.data.push(_findObj);
      }
    });
    if (_ids.length > 0) {
      GiphyApi.geImagesByIds(_ids)
        .then(response => {
          console.log(response);
          _result.data.push(response.data);
          this.setState({ placeholderResult: _result });
        })
        .catch(error => {
          toastr.error(error);
          this.setState({ error });
        });
    }
  }

  onTextChange(obj) {
    let _limit = this.state.limit;
    let _offset = this.state.offset;
    this.setState({ textSearch: obj.target.value });
    GiphyApi.getImages(_offset, _limit, obj.target.value)
      //.then(response => response.json())
      .then(data => {
        this.setState({ result: data, offset: _limit });
        // this.setState({offset:_limit});
        this.getImagesByID();
        toastr.success("Search Completed.");
      })
      .catch(error => {
        toastr.error(error);
        this.setState({ error });
      });
  }

  onLimitChange(obj) {
    this.setState({ limit: obj.target.value });
  }
  onDrop(component, name) {
    console.log("OnDrop", component, name);
    let result = this.state.result != null ? this.state.result : null;
    if (result) {
      let _item = result.data.filter(i => i.id === component.id);

      let _property = resolveFilter(this.state.dimension);

      this.setState({
        [name]: {
          url: _item[0].images[_property].url,
          id: component.id,
          details: {
            title: _item[0].title,
            username: _item[0].username,
            source: _item[0].source
          }
        } //.fixed_width.url
      });

      let _result = this.state.placeholderResult;
      var foundIndex =
        _result.data != null
          ? _result.data.findIndex(x => x.id === component.id)
          : -1;
      if (foundIndex > 0) {
        _result[foundIndex] = _item[0];
        this.setState({ placeholderResult: _result });
      }
    }
  }
  deleteItem = id => {
    //console.log('deleting ' + id);
  };
  render() {
    //let _result = this.state != null && this.state.result != null ? this.state.result : ;
    let filteredResult = applyFilter(
      this.state.result,
      this.state.filter,
      this.state.limit
    );
    let resultSwatches =
      filteredResult != null && filteredResult.data != null
        ? filteredResult.data.map(this.renderSwatch.bind(this))
        : null;

    return (
      <StyledAppContainer>
        <header className="masthead">
          <h1>
            <a href="/">
              <img src={logoUrl} alt="SoFi" height={64} />
              &nbsp;
              <span>Gifs</span>
            </a>
          </h1>
        </header>
        <div className="content-container">
          <main className="main">
            <div className="row" style={{ width: "99%" }}>
              <div style={{ width: "99%" }}>
                <input
                  className="search-input"
                  name="search"
                  placeholder="Search"
                  onChange={this.onTextChange.bind(this)}
                />

                <label htmlFor="selOptions" style={{ margin: "6px" }}>
                  Filter Options
                </label>

                <select
                  id="selOptions"
                  onChange={this.onFilter}
                  style={{ margin: "4px" }}
                >
                  <optgroup label="---Filter DropZone---" />
                  <option value={Filters.ORIGINAL}>Original</option>
                  <option value={Filters.SAMEHEIGHT}>Same Height</option>
                  <option value={Filters.SAMEWIDTH}>Same Width</option>
                  <optgroup label="---Filter Search Result ---" />
                  <option value={Filters.ALL}>{Filters.ALL}</option>
                  <option value={Filters.PARENTAL}>{Filters.PARENTAL}</option>
                  <option value={Filters.PG13}>{Filters.PG13}</option>
                  <option value={Filters.GENERAL}>{Filters.GENERAL}</option>
                  <option value={Filters.STICKER}>{Filters.STICKER}</option>
                  <option value={Filters.SCORE}>{Filters.SCORE}</option>
                  <option value={Filters.TRENDING}>{Filters.TRENDING}</option>
                </select>

                <input
                  className="search-input"
                  type="number"
                  id="limit"
                  name="limit"
                  placeholder="Limit"
                  min="5"
                  max="100"
                  style={{ width: "10%" }}
                  onChange={this.onLimitChange}
                />
              </div>
              <div
                id="overlay"
                style={{
                  display: this.state.isLoading === true ? "block" : "none"
                }}
              />

              {resultSwatches != null && resultSwatches.length > 0 && (
                <div>
                  <a href="#" id="Previous" onClick={this.onScrollChange}>
                    &laquo; Previous
                  </a>
                  &nbsp;&nbsp;
                  <a href="#" id="Next" onClick={this.onScrollChange}>
                    Next &raquo;
                  </a>
                  <div
                    className="scrolling-wrapper-flexbox"
                    onScroll={this.onScrollChange}
                  >
                    {resultSwatches}
                  </div>
                </div>
              )}
            </div>
            <div className="row">
              <div className="slider">
                <div className="slide" id="slide-1">
                  <GifDropzone
                    src={this.state.placeholder1.url}
                    details={this.state.placeholder1.details}
                    onDrop={this.onDrop}
                    name="placeholder1"
                  />
                  <a href="#" id="placeholder1" onClick={this.onShowInfo}>
                    {" "}
                    Show Info
                  </a>
                </div>
                <div className="slide" id="slide-2">
                  <GifDropzone
                    src={this.state.placeholder2.url}
                    details={this.state.placeholder1.details}
                    onDrop={this.onDrop}
                    name="placeholder2"
                  />
                  <a href="#" id="placeholder2" onClick={this.onShowInfo}>
                    {" "}
                    Show Info
                  </a>
                </div>
                <div className="slide" id="slide-3">
                  <GifDropzone
                    src={this.state.placeholder3.url}
                    details={this.state.placeholder1.details}
                    onDrop={this.onDrop}
                    name="placeholder3"
                  />
                  <a href="#" id="placeholder3" onClick={this.onShowInfo}>
                    {" "}
                    Show Info
                  </a>
                </div>
                <div className="slide" id="slide-4">
                  <GifDropzone
                    src={this.state.placeholder4.url}
                    onDrop={this.onDrop}
                    name="placeholder4"
                  />
                  <a href="#" id="placeholder4" onClick={this.onShowInfo}>
                    {" "}
                    Show Info
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
        <footer className="footer">
          {
            <a href={urls.sofiHomepage} target="_blank">
              About SoFi
            </a>
          }
          {" | "}
          {
            <a href={urls.sofiCareers} target="_blank">
              Work at SoFi
            </a>
          }
        </footer>
      </StyledAppContainer>
    );
  }
}

// Decorate component with dnd functionality
// See react-dnd docs: http://gaearon.github.io/react-dnd/docs-overview.html
export default DragDropContext(HTML5Backend)(App);
