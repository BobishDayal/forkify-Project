import icons from 'url:../../img/icons.svg'
import previewView from './previewView';
import view from "./view";



class addRecipeView extends view {

    _parentEl = document.querySelector('.upload');

    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');
    //_btnUpload = document.querySelector('.btn upload__btn');
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _input = document.querySelectorAll('input')
    _message = "Recipe is successfuly added 👍"

    constructor(){

        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
        
    }

    toggleWindow(){
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }


    _addHandlerShowWindow(){

        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerHideWindow(){

        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
        
    }

    addHandlerUpload(handler){
       this._parentEl.addEventListener('submit', function(e){

        e.preventDefault();

        const dataArr = [...new FormData(this)];
        const data = Object.fromEntries(dataArr);
        handler(data);
        
       });

    }

    

}

export default new addRecipeView();