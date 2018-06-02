import React from 'react';
import axios from 'axios';
// import Map from './Map/Map';
import NonProfitBasketList from './NonProfitBasketList/NonProfitBasketList';
import ScheduleList from './ScheduleList/ScheduleList';
import WishList from './WishList/WishList';
import Header from '../../components/Header/Header.js';
import './NonProfit.css';

class NonProfit extends React.Component {
  constructor() {
    super();
    this.state = {
      nonProfitID: 7,
      baskets: [],
      scheduledBaskets: [],
      wishlist: []
    };

    this.getBaskets = this.getBaskets.bind(this);
    this.getScheduledBaskets = this.getScheduledBaskets.bind(this);
    this.scheduleBasket = this.scheduleBasket.bind(this);
    this.cancelBasket = this.cancelBasket.bind(this);
  }

  componentDidMount() {
    this.getBaskets();
    this.getScheduledBaskets();
  }

  getBaskets() {
    const currentLocalTime = new Date().getTime();
    const businessIDs = [1, 2, 4, 6];

    axios
      .post(`/api/basket/${currentLocalTime}`, { businessIDs })
      .then((baskets) => {
        this.setState({
          baskets: baskets.data
        });
      });
  }

  getScheduledBaskets() {
    const { nonProfitID } = this.state;

    axios
      .get(`/api/scheduled/baskets/${nonProfitID}`)
      .then((scheduledBaskets) => {
        this.setState({
          scheduledBaskets: scheduledBaskets.data
        });
      });
  }

  getWishList() {
    const { nonProfitID } = this.state;

    axios.get(`/api/wishlist/${nonProfitID}`).then((wishlist) => {
      this.setState({
        wishlist: wishlist
      });
    });
  }

  scheduleBasket(scheduledTime, basketID) {
    const { nonProfitID } = this.state;

    let promise = axios.put(`/api/basket/update/${nonProfitID}`, {
      scheduledTime,
      basketID
    });

    Promise.all([promise]).then(() => {
      this.getScheduledBaskets();
      this.getBaskets();
    });

    alert('Reservation Successful!');
  }

  cancelBasket(basketID) {
    let promise = axios.put(`/api/basket/cancel/${basketID}`);

    Promise.all([promise]).then(() => {
      this.getScheduledBaskets();
      this.getBaskets();
    });

    alert('Reservation Canceled!');
  }

  render() {
    const { baskets, scheduledBaskets } = this.state;

    return (
      <main className="mobile">
        <Header />
        <div className="nonprofit_main">
          <h2>Non Profit Page</h2>
        </div>
        <h3>Wish List</h3>
        <WishList />
        <h3>Scheduled Baskets</h3>
        <ScheduleList
          scheduledBaskets={scheduledBaskets}
          _scheduleBasket={this.scheduleBasket}
          _cancelBasket={this.cancelBasket}
        />
        <h3>Available Baskets</h3>
        <NonProfitBasketList
          baskets={baskets}
          _scheduleBasket={this.scheduleBasket}
        />
      </main>
    );
  }
}

export default NonProfit;
