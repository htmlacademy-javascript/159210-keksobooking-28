const Offer = function (info) {
  this.author = {
    avatar: info.author.avatar
  };
  this.offer = {
    title: info.offer.title,
    address: info.offer.address,
    price: info.offer.price
  };
  this.type = info.offer.type;
  this.rooms = info.offer.rooms;
  this.guests = info.offer.guests;
  this.checkin = info.offer.checkin;
  this.checkout = info.offer.checkout;
  this.features = info.offer.features;
  this.description = info.offer.description;
  this.photos = info.offer.photos;
  this.location = {
    lat: info.location.lat,
    lng: info.location.lng
  };
};

const createOffers = (data) => {
  const newOffersList = [];
  data.forEach((entry) => {
    const newOffer = new Offer(entry);
    newOffersList.push(newOffer);
  });
  return newOffersList;
};

export { createOffers };
