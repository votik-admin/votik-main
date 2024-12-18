import __stayListing from "./jsons/__stayListing.json";
import __carsListing from "./jsons/__carsListing.json";
import __experiencesListing from "./jsons/__experiencesListing.json";
import {
  DEMO_STAY_CATEGORIES,
  DEMO_EXPERIENCES_CATEGORIES,
} from "./taxonomies";
import { CarDataType, ExperiencesDataType, StayDataType } from "./types";
import { DEMO_AUTHORS } from "./authors";
import car1 from "@app/images/cars/1.png";
import car2 from "@app/images/cars/2.png";
import car3 from "@app/images/cars/3.png";
import car4 from "@app/images/cars/4.png";
import car5 from "@app/images/cars/5.png";
import car6 from "@app/images/cars/6.png";
import car7 from "@app/images/cars/7.png";
import car8 from "@app/images/cars/8.png";
import car9 from "@app/images/cars/9.png";
import car10 from "@app/images/cars/10.png";
import car11 from "@app/images/cars/11.png";
import car12 from "@app/images/cars/12.png";
import car13 from "@app/images/cars/13.png";
import car14 from "@app/images/cars/14.png";
import car15 from "@app/images/cars/15.png";
import car16 from "@app/images/cars/16.png";
const carsImgs = [
  car1.src,
  car2.src,
  car3.src,
  car4.src,
  car5.src,
  car6.src,
  car7.src,
  car8.src,
  car9.src,
  car10.src,
  car11.src,
  car12.src,
  car13.src,
  car14.src,
  car15.src,
  car16.src,
];

const DEMO_STAY_LISTINGS = __stayListing.map((post, index): StayDataType => {
  //  ##########  GET CATEGORY BY CAT ID ######## //
  const category = DEMO_STAY_CATEGORIES.filter(
    (taxonomy) => taxonomy.id === post.listingCategoryId
  )[0];

  return {
    ...post,
    id: `stayListing_${index}_`,
    saleOff: !index ? "-20% today" : post.saleOff,
    isAds: !index ? true : post.isAds,
    author: DEMO_AUTHORS.filter((user) => user.id === post.authorId)[0],
    listingCategory: category,
  };
});

const DEMO_EXPERIENCES_LISTINGS = __experiencesListing.map(
  (post, index): ExperiencesDataType => {
    //  ##########  GET CATEGORY BY CAT ID ######## //
    const category = DEMO_EXPERIENCES_CATEGORIES.filter(
      (taxonomy) => taxonomy.id === post.listingCategoryId
    )[0];

    return {
      ...post,
      id: `experiencesListing_${index}_`,
      saleOff: !index ? "-20% today" : post.saleOff,
      isAds: !index ? true : post.isAds,
      author: DEMO_AUTHORS.filter((user) => user.id === post.authorId)[0],
      listingCategory: category,
    };
  }
);

const DEMO_CAR_LISTINGS = __carsListing.map((post, index): CarDataType => {
  //  ##########  GET CATEGORY BY CAT ID ######## //
  const category = DEMO_EXPERIENCES_CATEGORIES.filter(
    (taxonomy) => taxonomy.id === post.listingCategoryId
  )[0];

  return {
    ...post,
    id: `carsListing_${index}_`,
    saleOff: !index ? "-20% today" : post.saleOff,
    isAds: !index ? true : post.isAds,
    author: DEMO_AUTHORS.filter((user) => user.id === post.authorId)[0],
    listingCategory: category,
    featuredImage: carsImgs[index],
  };
});

export { DEMO_STAY_LISTINGS, DEMO_EXPERIENCES_LISTINGS, DEMO_CAR_LISTINGS };
