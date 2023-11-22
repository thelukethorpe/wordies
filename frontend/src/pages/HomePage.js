import React from "react";
import "../style/common/Page.css";
import HomeCrosswordPortal from "../components/home/HomeCrosswordPortal";
import AutoFlippingHomeTitle from "../components/home/HomeAutoFlippingTitle";

export default function HomePage() {
  const homePageTitle = "wordies";
  const styles = {
    homeTitle: {
      padding: 50
    }
  };

  return (
    <div className="Page">
      <AutoFlippingHomeTitle title={homePageTitle} style={styles.homeTitle} />
      <HomeCrosswordPortal />
    </div>
  );
}
