import React from 'react';
import axios from 'axios';

// import Map from './Map/Map';
import Header from '../../components/Header/Header.js';
import NonProfitBasketList from './NonProfitBasketList/NonProfitBasketList';
import ScheduleList from './ScheduleList/ScheduleList';
import Search from './Search/Search';
import Sort from './Sort/Sort';
import WishList from './WishList/WishList';

import * as searchUtil from '../../../config/searchUtil';
import * as sortUtil from '../../../config/sortUtil';

import './NonProfit.css';

class NonProfit extends React.Component {
  constructor() {
    super();
    this.state = {
      nonProfitID: 7,
      nonProfitInfo: '',
      baskets: [],
      wishList: [],
      scheduledBaskets: [],
      searchInput: ''
    };

    this.initializeComponent = this.initializeComponent.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.scheduleBasket = this.scheduleBasket.bind(this);
    this.cancelBasket = this.cancelBasket.bind(this);
    this.createWishList = this.createWishList.bind(this);
    this.addWishListItem = this.addWishListItem.bind(this);
    this.parent_editWishListItem = this.parent_editWishListItem.bind(this);
    this.removeWishListItem = this.removeWishListItem.bind(this);
    this.modifyWishListItem = this.modifyWishListItem.bind(this);
    this.sortBaskets = this.sortBaskets.bind(this);
    this.searchBaskets = this.searchBaskets.bind(this);
  }

  componentDidMount() {
    this.initializeComponent();
  }

  initializeComponent() {
    const { nonProfitID } = this.state;
    const currentLocalTime = new Date().getTime();
    const businessIDs = [1, 2, 3, 4, 5, 6, 7, 8];
    // const businessIDs = [60, 70, 80];

    let basketPromise = axios
      .post(`/api/basket/${currentLocalTime}`, { businessIDs })
      .then((baskets) => {
        this.setState({
          baskets: baskets.data
        });
      });

    let wishListPromise = axios
      .get(`/api/wishlist/${nonProfitID}`)
      .then((wishList) => {
        this.setState({
          wishList: wishList.data[0]
        });
      });

    let schedulePromise = axios
      .get(`/api/scheduled/baskets/${nonProfitID}`)
      .then((scheduledBaskets) => {
        this.setState({
          scheduledBaskets: scheduledBaskets.data
        });
      });

    Promise.all([basketPromise, wishListPromise, schedulePromise]).then(() => {
      const { baskets, wishList } = this.state;

      if (baskets.length > 0) {
        let modifiedBaskets = sortUtil.sortByWishList(baskets, wishList);

        this.setState({
          baskets: modifiedBaskets
        });
      }
    });
  }

  handleChange(key, value) {
    this.setState({
      [key]: value
    });
  }

  scheduleBasket(scheduledTime, phoneNumber, message, basketID) {
    const { nonProfitID } = this.state;

    let promise = axios.put(`/api/basket/update/${nonProfitID}`, {
      scheduledTime,
      phoneNumber,
      message,
      basketID
    });

    Promise.all([promise]).then(() => {
      this.initializeComponent();
    });

    alert('Reservation Successful!');
  }

  cancelBasket(phoneNumber, basketID) {
    const message = `Basket ${basketID} pickup has been canceled.`;

    let promise = axios.put(`/api/basket/cancel/${basketID}`, {
      phoneNumber,
      message
    });

    Promise.all([promise]).then(() => {
      this.initializeComponent();
    });

    alert('Reservation Canceled!');
  }

  createWishList() {
    const { nonProfitID } = this.state;

    axios.post(`/api/wishlist/${nonProfitID}`).then(() => {
      this.initializeComponent();
    });
  }

  addWishListItem(e, item) {
    e.preventDefault();
    const updatedWishList = [...this.state.wishList.items, { item: item }];

    this.modifyWishListItem(updatedWishList);
  }

  parent_editWishListItem(e, idx, item) {
    e.preventDefault();
    const updatedWishList = [...this.state.wishList.items];

    updatedWishList.splice(idx, 1, { item: item });
    this.modifyWishListItem(updatedWishList);
  }

  removeWishListItem(idx) {
    const updatedWishList = [...this.state.wishList.items];

    updatedWishList.splice(idx, 1);
    this.modifyWishListItem(updatedWishList);
  }

  modifyWishListItem(updatedWishList) {
    const { nonProfitID } = this.state;

    axios
      .put(`/api/wishlist/modify/${nonProfitID}`, { updatedWishList })
      .then(() => {
        this.initializeComponent();
      });
  }

  sortBaskets(sortType) {
    const { baskets, wishList } = this.state;
    let modifiedBaskets;

    if (baskets.length > 0) {
      switch (sortType) {
        case 'wishlist':
          if (wishList.items && wishList.items.length > 0) {
            modifiedBaskets = sortUtil.sortByWishList(baskets, wishList);
            this.setState({
              baskets: modifiedBaskets
            });
          } else {
            alert('Add items to Wish List!');
          }
          break;

        case 'latest':
          modifiedBaskets = sortUtil.sortRecent(baskets);
          this.setState({
            baskets: modifiedBaskets
          });
          break;

        case 'oldest':
          modifiedBaskets = sortUtil.sortOldest(baskets);
          this.setState({
            baskets: modifiedBaskets
          });
          break;
      }
    }
  }

  searchBaskets(e) {
    e.preventDefault();
    const { baskets, searchInput } = this.state;
    const currentLocalTime = new Date().getTime();
    const businessIDs = [1, 2, 3, 4, 5, 6, 7, 8];

    axios
      .post(`/api/basket/${currentLocalTime}`, { businessIDs })
      .then((baskets) => {
        let modifiedBaskets = searchUtil.searchBaskets(
          baskets.data,
          searchInput
        );

        this.setState({
          baskets: modifiedBaskets
        });
      });
  }

  render() {
    const { baskets, scheduledBaskets, wishList, searchInput } = this.state;

    return (
      <main className="mobile">
        <Header />
        <div className="nonprofit_main">
          <h2>Non Profit Page</h2>
        </div>
        <WishList
          _wishList={wishList}
          _createWishList={this.createWishList}
          _addWishListItem={this.addWishListItem}
          parent_editWishListItem={this.parent_editWishListItem}
          _removeWishListItem={this.removeWishListItem}
        />
        <h2>Scheduled Baskets</h2>
        <ScheduleList
          _scheduledBaskets={scheduledBaskets}
          _scheduleBasket={this.scheduleBasket}
          _cancelBasket={this.cancelBasket}
        />
        <h2>Available Baskets</h2>
        <Search
          _searchInput={searchInput}
          _initializeComponent={this.initializeComponent}
          _handleChange={this.handleChange}
          _searchBaskets={this.searchBaskets}
        />
        <Sort _sortBaskets={this.sortBaskets} />
        <NonProfitBasketList
          _baskets={baskets}
          _scheduleBasket={this.scheduleBasket}
        />
      </main>
    );
  }
}

export default NonProfit;
