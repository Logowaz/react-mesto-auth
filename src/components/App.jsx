import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import successPicture from '../images/success-picture.png'
import failPicture from '../images/fail-picture.png'
import api from "../utils/Api.js";
import Header from "./Header.jsx";
import Main from "./Main.jsx";
import Footer from "./Footer.jsx";
import ImagePopup from './ImagePopup.jsx';
import ConfirmDeletePopup from './ConfirmDeletePopup.jsx';
import EditProfilePopup from './EditProfilePopup.jsx';
import EditAvatarPopup from './EditAvatarPopup.jsx';
import AddPlacePopup from './AddPlacePopup.jsx';
import * as Auth from '../utils/Auth.js';
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import ProtectedRoute from './ProtectedRoute.jsx'
import PageNotFound from "./PageNotFound.jsx";
import InfoTooltip from "./InfoTooltip.jsx"

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userMail, setUserMail] = useState('');
  const [toolTipData, setToolTipData] = useState({ status: false, message: '', image: '' });

  const navigate = useNavigate();

  React.useEffect(() => {
    if (loggedIn) { 
      api.getUserInfo()
        .then((userData) => {
          setCurrentUser(userData);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  React.useEffect(() => {
    if (loggedIn) { 
      api.getInitialCards()
        .then((cards) => {
          setCards(cards);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);


  function handleEditProfilePopup () {
    setIsEditProfilePopupOpen (true);
  }
  
  function handleAddPlacePopupOpen() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarPopupOpen() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleConfirmPopupOpen(card) {
    setSelectedCard(card);
    setIsConfirmDeletePopupOpen(true);
  }

  function handleCheckStatusLoginSuccsess() {
    setToolTipData({ status: true, message: 'Вы успешно зарегистрировались!', image: 'successLogo' });
  }


  function handleCheckStatusLoginFail() {
    setToolTipData({ status: true, message: 'Что-то пошло не так! Попробуйте еще раз.' , image: 'errorLogo' });
  }

  function closeAllPopups() {
    // debugger
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsConfirmDeletePopupOpen(false);
    setIsImagePopupOpen(false);
    setToolTipData({ status: false, message: '', image: '' });
  }

  function handleCardClick(card) {
    
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function handleCardDelete() {
    api.deleteCard(selectedCard._id).then(() => {
      setCards((state) => state.filter((c) => c._id !== selectedCard._id));
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function handleUpdateUser(value) {
    api.setUserInfo(value)
    .then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function handleUpdateAvatar(card) {
    api.setAvatar(card).then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function handleAddPlaceSubmit(card) {
    api.addCard(card).then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  const tokenCheck = () => {
    const jwt = localStorage.getItem('jwt')
    if (jwt) {
      Auth.getContent(jwt)
      .then(
        (user) => {
          handleLogin(user);
          navigate('/', {replace: true})
          setUserMail(user.data.email);
        }
      )
      .catch(err => console.log(err))
    }
  }

  const handleLogin = (email) => {
    setLoggedIn(true);
    setUserMail(email);
  }

  useEffect(() => {
    tokenCheck();
  }, [])

  function singOut() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
  }

  function handleCheckRegister(password, email) {
    Auth.register({password, email})
    .then((res) => {
        handleCheckStatusLoginSuccsess();
        navigate('/signin', { replace: true })
    })
    .catch((err) => {
        handleCheckStatusLoginFail(err);
        console.log(`ошибка ${err}`);
    })
  }

  function handleCheckLogin(password, email) {
    Auth.authorize({password, email})
    .then((res) => {
    console.log(res)
        if (res.token) {
            localStorage.setItem('jwt', res.token);
            handleLogin(email);
            navigate('/', { replace: true });
        }
    })
    .catch((err) => {
      handleCheckStatusLoginFail();
      console.log(`ошибка ${err}`)
    })
  }

  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>
        <Header loggedIn={loggedIn} userMail={userMail} singOut={singOut}/>

        <Routes>
          <Route path="/signup" element={<Register handleCheckRegister={handleCheckRegister}/>} />
          <Route path="/signin" element={<Login handleCheckLogin={handleCheckLogin}/>} />
          <Route  path="/" element={<ProtectedRoute element={Main} loggedIn={loggedIn} 
          onEditProfile={handleEditProfilePopup}
          onAddPlace={handleAddPlacePopupOpen}
          onEditAvatar={handleEditAvatarPopupOpen}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          onCardDelete={handleConfirmPopupOpen}
          cards={cards}
          />} />
          <Route path="/" element={loggedIn ? <Navigate to ="/" /> : <Navigate to="/signin" replace/>}/>
          <Route path="*" element={<PageNotFound />}/>
        </Routes>
        
        {loggedIn && <Footer />}

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        >
        </EditProfilePopup>

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onUpdateCards={handleAddPlaceSubmit}
        >
        </AddPlacePopup>

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        >
        </EditAvatarPopup>

        <ConfirmDeletePopup
          isOpen={isConfirmDeletePopupOpen}
          onClose={closeAllPopups}
          onSubmitConfirmDelete={handleCardDelete}
        >
        </ConfirmDeletePopup>

        <ImagePopup
          card={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups} 
        />

        <InfoTooltip
          name={toolTipData.message === 'Вы успешно зарегистрировались!' ? 'successMessage' : 'errorMessage'}
          logo={toolTipData.image !== '' ? (toolTipData.image === 'successLogo' ? successPicture : failPicture) : null}
          textMessage={toolTipData.message}
          isOpen={toolTipData.status}
          onClose={closeAllPopups}
        />

      </CurrentUserContext.Provider>
  </>
  )
}

export default App
