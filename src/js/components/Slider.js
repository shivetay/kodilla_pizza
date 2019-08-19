{
    'use strict';
    let slideIndex = 0;

    sliderOpinion();


    function sliderOpinion(){
        const getDivs = document.querySelectorAll('.carousel__slide');
        for(let i = 0; i < getDivs.length; i++){
            getDivs[i].style.display = 'none';
        }
        slideIndex++;
        if(slideIndex > getDivs.length) {
            slideIndex = 1;
        }
        getDivs[slideIndex-1].style.display = 'block';
        setTimeout(sliderOpinion, 4000);
    }
}



