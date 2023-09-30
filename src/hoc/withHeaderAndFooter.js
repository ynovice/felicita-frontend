import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/PageWithHeaderAndFooter.css";

function withHeaderAndFooter(WrappedPage) {

    function PageWithHeaderAndFooter () {
        return (
            <div className="PageWithHeaderAndFooter">
                <Header/>
                <WrappedPage/>
                <Footer/>
            </div>
        );
    }

    return PageWithHeaderAndFooter;
}

export default withHeaderAndFooter;