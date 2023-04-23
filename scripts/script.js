const UserStatus = {  
  LoggedIn: "Logged In",
  LoggingIn: "Logging In",
  LoggedOut: "Logged Out",
  LogInError: "Log In Error",
  VerifyingLogIn: "Verifying Log In"
}

const Default = {
  PIN: "1234"
}

const WeatherType = {
  Cloudy: "Cloudy",
  Rainy: "Rainy",
  Stormy: "Stormy",
  Sunny: "Sunny"
}


function createAppBackground() {
  const appBackground = document.createElement("div")
  appBackground.id = "app-background"

  const appBackgroundImage = document.createElement("div")
  appBackgroundImage.id = "app-background-image"
  appBackgroundImage.classList.add("background-image")

  appBackground.appendChild(appBackgroundImage)
  document.getElementById("root").appendChild(appBackground)
}

function createBounceButtonLoggedOut() {
  createBounceButton(document.getElementById("root"), "sign-in")
}

function createBounceButton(element, id) {
  const bounceButtonDiv = document.createElement("div")
  bounceButtonDiv.id = id + "-button-wrapper"

  const bounceButton = document.createElement("button")
  bounceButton.id = id + "-button"
  bounceButton.type = "button"
  bounceButton.classList.add("user-status-button")
  bounceButton.classList.add("clear-button")


  const arrowIcon = document.createElement("i")
  arrowIcon.classList.add("fa")
  arrowIcon.classList.add("fa-arrow-right")

  bounceButton.appendChild(arrowIcon)
  bounceButtonDiv.appendChild(bounceButton)
  element.appendChild(bounceButtonDiv)
}

function createInfoContainer(element, id) {
  const infos = document.createElement("div")
  infos.id = id + "-info"
  infos.classList.add("info")

  const currentTime = document.createElement("span")
  currentTime.id =  id + "-time"
  currentTime.classList.add("time")

  infos.appendChild(currentTime)
  element.appendChild(infos)
}

function displayCurrentTime() {
  var currentTime = new Date();
  var hour = currentTime.getHours();
  var minute = currentTime.getMinutes();

  hour = (hour < 10 ? "0" : "") + hour;
  minute = (minute < 10 ? "0" : "") + minute;

  var currentTimeFormatted = hour + ":" + minute;
  if (previousTime !== currentTimeFormatted) {
    document.getElementById("app-time").innerHTML = currentTimeFormatted;
    document.getElementById("app-menu-time").innerHTML = currentTimeFormatted;
    previousTime = currentTimeFormatted
  }

  setTimeout( () => {
    displayCurrentTime()
  }, 1000);
}

function createPinWrapper() {
  const appPinWrapper = document.createElement("div")
  appPinWrapper.id = "app-pin-wrapper"

  const appPinHiddenInput = document.createElement("input")
  appPinHiddenInput.id = "app-pin-hidden-input"
  appPinHiddenInput.maxlength = 4
  appPinHiddenInput.type = "number"
  appPinHiddenInput.value = pin
  appPinHiddenInput.addEventListener("input", (event) => {
    handleOnChange(event)
  });
  appPinWrapper.appendChild(appPinHiddenInput)

  const appPin = document.createElement("div")
  appPin.id = "app-pin"
  appPin.addEventListener("click", () => {
    inputFocus()
  });

  window.addEventListener("click", (event) => {
    const isClickInsideAppPin = appPin.contains(event.target);
    const excludedElement = document.getElementById('sign-in-button');
    const isClickInsideExcludedElement = excludedElement.contains(event.target);
    if (!isClickInsideAppPin && !isClickInsideExcludedElement) {
      const focusedDigit = document.querySelector(".app-pin-digit-focused")
      if (focusedDigit != null) {
        focusedDigit.classList = "app-pin-digit";
      }
    }
  });

  for (var i = 0; i < 4; i++) {
    const appPinDigit = document.createElement("div")
    appPinDigit.id = "app-pin-digit" + i
    if (i == 0) {
      appPinDigit.classList.add("app-pin-digit-focused");
    }
    const appPinDigitValue = document.createElement("span")
    appPinDigitValue.classList.add("app-pin-digit-value")
    appPinDigit.appendChild(appPinDigitValue)
    appPin.appendChild(appPinDigit)
  }
  appPinWrapper.appendChild(appPin)
    
  const appPinLabel = document.createElement("h3")
  appPinLabel.id = "app-pin-label"
  appPinLabel.innerHTML = "Enter PIN (1234)" 

  const appPinCancelText = document.createElement("span")
  appPinCancelText.id = "app-pin-cancel-text"
  appPinCancelText.innerHTML = "Cancel"
  appPinCancelText.addEventListener("click", () => {
    handleOnCancel()
  });
  appPinLabel.appendChild(appPinCancelText)
  appPinWrapper.appendChild(appPinLabel)
  
  document.getElementById("root").appendChild(appPinWrapper)
}

function inputFocus() {
  document.getElementById("app-pin-hidden-input").focus();
  changeDigitsAppareance()
}

function changeDigitsAppareance() {
  const digits = document.querySelectorAll('[id^="app-pin-digit"]');
  for (var i = 0; i < digits.length; i++) {
    const digit = digits[i];
    if (i >= pin.length) {
          digit.classList = "app-pin-digit"
          digit.querySelector(".app-pin-digit-value").classList = "app-pin-digit-value" 
          if (pin.length === i) {
            digit.classList.add("app-pin-digit-focused");
            digit.querySelector(".app-pin-digit-value").innerHTML = "&nbsp;";
            digit.focus();
          }
    } else {
      digit.classList.remove("app-pin-digit-focused");
      digit.querySelector(".app-pin-digit-value").innerHTML = pin[i] || "";
      if (i < pin.length && i !== 3) {
        setTimeout(() => {
          digit.classList = "app-pin-digit app-pin-digit-hidden"
          digit.querySelector(".app-pin-digit-value").classList = "app-pin-digit-value app-pin-digit-value-hidden"
        }, 500)   
      } else if (i == pin.length -1 && i == 3) {
        digit.classList = "app-pin-digit app-pin-digit-hidden"
        digit.querySelector(".app-pin-digit-value").classList = "app-pin-digit-value app-pin-digit-value-hidden"
      }
    }
  }
}

function handleOnChange(e) {
  if(e.target.value.length <= 4) {
    pin = e.target.value.toString();
  }
  changeDigitsAppareance()
  if (pin.length === 4) {
    checkAndValidatePassword()  
  }
  
}

function checkAndValidatePassword() {
  setUserStatusTo(UserStatus.VerifyingLogIn)
  setTimeout(() => {
    if (pin == Default.PIN) {
      setUserStatusTo(UserStatus.LoggedIn)
      resetPin()
    } else {
      resetPin()
      setUserStatusTo(UserStatus.LogInError) 
    }
  }, 1000)
}
  
function handleOnCancel() {
  setUserStatusTo(UserStatus.LoggedOut);
  resetPin()
}

function resetPin() {
  pin = ''
  const input = document.getElementById("app-pin-hidden-input").value = pin
  const digits = document.querySelectorAll('[id^="app-pin-digit"]');
  for (var i = 0; i < digits.length; i++) {
    const digit = digits[i];
    digit.querySelector(".app-pin-digit-value").classList = "app-pin-digit-value"
    digit.querySelector(".app-pin-digit-value").innerHTML = ""
    if (i === 0) {
      digit.classList = "app-pin-digit app-pin-digit-focused";
    } else {
      digit.classList = "app-pin-digit";
    };
  }
}

function createLoadingIcon() {
  const loadingIconDiv = document.createElement("div")
  loadingIconDiv.id = "app-loading-icon"

  const loadingIcon = document.createElement("i")
  loadingIcon.classList.add("fa")
  loadingIcon.classList.add("fa-circle-o-notch")

  loadingIconDiv.appendChild(loadingIcon)
  document.getElementById("root").appendChild(loadingIconDiv)
}

function createAppMenuContainer() {
  const appMenu = document.createElement("div")
  appMenu.id = "app-menu"

  const appMenuContentWrapper = document.createElement("div")
  appMenuContentWrapper.id = "app-menu-content-wrapper"

  const appMenuContent = document.createElement("div")
  appMenuContent.id = "app-menu-content"

  const appMenuContentHeader = document.createElement("div")
  appMenuContentHeader.id = "app-menu-content-header"

  appMenuContent.appendChild(appMenuContentHeader)
  appMenuContentWrapper.appendChild(appMenuContent)
  appMenu.appendChild(appMenuContentWrapper)
  document.getElementById("root").appendChild(appMenu)

  const appMenuContentHeaderSection = document.createElement("div")
  appMenuContentHeaderSection.id = "app-menu-content-header-section-infos"
  appMenuContentHeaderSection.classList = "app-menu-content-header-section"
  document.getElementById("app-menu-content-header").appendChild(appMenuContentHeaderSection)
  createTimeAndWeatherLoggedInDiv()  

  const appMenuContentHeaderSectionButton = document.createElement("div")
  appMenuContentHeaderSectionButton.id = "app-menu-content-header-section-button"
  appMenuContentHeaderSectionButton.classList =  "app-menu-content-header-section"
  document.getElementById("app-menu-content-header").appendChild(appMenuContentHeaderSectionButton)
  createBounceButton(document.getElementById("app-menu-content-header-section-button"), "sign-out")


  
  
  createNavClearButtonsDiv(document.getElementById("app-menu-content"))
  createWeatherSelectionDiv(document.getElementById("app-menu-content"))
  createFoodCardsDiv(document.getElementById("app-menu-content"))
  createHappeningCards(document.getElementById("app-menu-content"))
  createMovieCardDiv(document.getElementById("app-menu-content"))
}

function createTimeAndWeatherLoggedInDiv() {
  createInfoContainer(document.getElementById("app-menu-content-header-section-infos"), "app-menu")
  createExtraCoolMeetingDiv(document.getElementById("app-menu-content-header-section-infos"))
}

function createExtraCoolMeetingDiv(element) {
  const reminder = document.createElement("div")
  reminder.classList = "reminder"

  const reminderIcon = document.createElement("div")
  reminderIcon.classList = "reminder-icon"

  const bellIcon = document.createElement("i")
  bellIcon.classList.add("fa")
  bellIcon.classList.add("fa-bell")
  reminderIcon.appendChild(bellIcon)

  const reminderText = document.createElement("span")
  reminderText.classList = "reminder-text"
  reminderText.innerHTML = "Extra cool people meeting "

  const reminderTime = document.createElement("span")
  reminderTime.classList = "reminder-time"
  reminderTime.innerHTML = "10H"

  reminderText.appendChild(reminderTime)
  reminder.appendChild(reminderIcon)
  reminder.appendChild(reminderText)
  element.appendChild(reminder)
}

function handleOnMouseDown(e, element) {
    
  grabbing = true
  position = {
    x: e.clientX,
    left: element.scrollLeft
  }
}

function handleOnMouseMove(e, element) {
  if(grabbing) {
    const left = Math.max(0, position.left + (position.x - e.clientX));
    element.scrollLeft = left;
  }
}

function handleOnMouseUp() {
  grabbing = false
  position = null
}

function createNavClearButtonsDiv(element) {
  let items = [{
      id: 1,
      label: "Weather"
    }, {
      id: 2,
      label: "Food"
    }, {
      id: 3,
      label: "Apps"
    }, {
      id: 4,
      label: "Movies"
    }]

  const scrollableComponent = document.createElement("div")
  scrollableComponent.id = "quick-nav"
  scrollableComponent.classList.add("scrollable-component")
  scrollableComponent.addEventListener("mousedown", (e) => {
    handleOnMouseDown(e, document.getElementById("quick-nav"))
  });
  scrollableComponent.addEventListener("mousemove", (e) => {
    handleOnMouseMove(e, document.getElementById("quick-nav"))
  });
  scrollableComponent.addEventListener("mouseup", () => {
    handleOnMouseUp()
  });
  scrollableComponent.addEventListener("mouseleave", () => {
    handleOnMouseUp()
  });   

  for(item of items) {
    const quickNavItem = document.createElement("div")
    quickNavItem.classList.add("quick-nav-item")
    quickNavItem.classList.add("clear-button")
    quickNavItem.key= item.id

    const quickNavItemLabel = document.createElement("span")
    quickNavItemLabel.classList.add("quick-nav-item-label")
    quickNavItemLabel.innerHTML = item.label

    quickNavItem.appendChild(quickNavItemLabel)
    scrollableComponent.appendChild(quickNavItem)
  }

  element.appendChild(scrollableComponent)

}

function getRandomArbitrary(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getIcon() {
  switch(day.weather) {
    case WeatherType.Cloudy:
      return "fa-cloud";
    case WeatherType.Rainy:
      return "fa-umbrella";
    case WeatherType.Stormy:
      return "fa-low-vision";
    case WeatherType.Sunny:
      return "fa-sun-o";
  }
}

function createWeatherSelectionDiv(element) {
  const days = [{
      id: 1,
      name: "Mon",
      temperature: getRandomArbitrary(0,20),
      weather: WeatherType.Sunny
    }, {
      id: 2,
      name: "Tues",
      temperature: getRandomArbitrary(0,20),
      weather: WeatherType.Sunny
    }, {
      id: 3,
      name: "Wed",
      temperature: getRandomArbitrary(0,20),
      weather: WeatherType.Cloudy
    }, {
      id: 4,
      name: "Thurs",
      temperature: getRandomArbitrary(0,20),
      weather: WeatherType.Rainy
    }, {
      id: 5,
      name: "Fri",
      temperature: getRandomArbitrary(0,20),
      weather: WeatherType.Stormy
    }, {
      id: 6,
      name: "Sat",
      temperature: getRandomArbitrary(0,20),
      weather: WeatherType.Sunny
    }, {
      id: 7,
      name: "Sun",
      temperature: getRandomArbitrary(0,20),
      weather: WeatherType.Cloudy
    }]

  const weatherSection = document.createElement("div")
  weatherSection.id = "weather-section"
  weatherSection.classList.add("menu-section")

  const weatherSectionTitle = document.createElement("div")
  weatherSectionTitle.id = "weather-section-title"
  weatherSectionTitle.classList.add("menu-section-title")

  const weatherSectionTitleIcon = document.createElement("i")
  weatherSectionTitleIcon.classList.add("fa")
  weatherSectionTitleIcon.classList.add("fa-sun-o")
  weatherSectionTitle.appendChild(weatherSectionTitleIcon)  

  const weatherSectionTitleText = document.createElement("span")
  weatherSectionTitleText.classList.add("menu-section-title-text")
  weatherSectionTitleText.innerHTML = "How's it look out there?"
  weatherSectionTitle.appendChild(weatherSectionTitleText)   

  const weatherSectionContent = document.createElement("div")
  weatherSectionContent.id = "weather-section-content"
  weatherSectionContent.classList.add("scrollable-component") 
  weatherSectionContent.classList.add("menu-section-content")
  weatherSectionContent.addEventListener("mousedown", (e) => {
    handleOnMouseDown(e, document.getElementById("weather-section-content"))
  });
  weatherSectionContent.addEventListener("mousemove", (e) => {
    handleOnMouseMove(e, document.getElementById("weather-section-content"))
  });
  weatherSectionContent.addEventListener("mouseup", () => {
    handleOnMouseUp()
  });
  weatherSectionContent.addEventListener("mouseleave", () => {
    handleOnMouseUp()
  });   

  for(day of days) {
    const dayCard = document.createElement("div")
    dayCard.classList.add("day-card")
    dayCard.key= day.id

    const dayCardContent = document.createElement("div")
    dayCardContent.classList.add("day-card-content")

    const dayWeatherTemperature = document.createElement("span")
    dayWeatherTemperature.classList.add("day-weather-temperature")
    dayWeatherTemperature.innerHTML = day.temperature

    const dayWeatherTemperatureUnit = document.createElement("span")
    dayWeatherTemperatureUnit.classList.add("day-weather-temperature-unit")
    dayWeatherTemperatureUnit.innerHTML = "°C"
    dayWeatherTemperature.appendChild(dayWeatherTemperatureUnit)

    const dayWeatherIcon = document.createElement("i")
    dayWeatherIcon.classList.add("day-weather-icon")
    dayWeatherIcon.classList.add(day.weather.toLowerCase())
    dayWeatherIcon.classList.add("fa")
    dayWeatherIcon.classList.add(getIcon(day.weather))

    const dayName = document.createElement("span")
    dayName.classList.add("day-name")
    dayName.innerHTML = day.name


    dayCardContent.appendChild(dayWeatherTemperature)
    dayCardContent.appendChild(dayWeatherIcon)
    dayCardContent.appendChild(dayName)
    dayCard.appendChild(dayCardContent)
    weatherSectionContent.appendChild(dayCard)
  }

  weatherSection.appendChild(weatherSectionTitle)
  weatherSection.appendChild(weatherSectionContent)
  element.appendChild(weatherSection)
}

function createFoodCardsDiv(element) {
  const restaurants = [{
      desc: "The best burgers in town",
      id: 1,
      image: "images/photo-1606131731446-5568d87113aa.avif",
      title: "Burgers"
    } , {
      desc: "The worst ice-cream around",
      id: 2,
      image: "images/photo-1576506295286-5cda18df43e7.avif",
      title: "Ice Cream"
    }, {
      desc: "This 'Za be gettin down",
      id: 3,
      image: "images/photo-1590947132387-155cc02f3212.avif",
      title: "Pizza"
    }, {
      desc: "BBQ ain't need no rhyme",
      id: 4,
      image: "images/photo-1529193591184-b1d58069ecdd.avif",
      title: "BBQ"
    }]

  const restaurantSection = document.createElement("div")
  restaurantSection.id = "restaurants-section"
  restaurantSection.classList.add("menu-section")

  const restaurantSectionTitle = document.createElement("div")
  restaurantSectionTitle.id = "restaurant-section-title"
  restaurantSectionTitle.classList.add("menu-section-title")

  const restaurantSectionTitleIcon = document.createElement("i")
  restaurantSectionTitleIcon.classList.add("fa")
  restaurantSectionTitleIcon.classList.add("fa-cutlery")
  restaurantSectionTitle.appendChild(restaurantSectionTitleIcon)  

  const restaurantSectionTitleText = document.createElement("span")
  restaurantSectionTitleText.classList.add("menu-section-title-text")
  restaurantSectionTitleText.innerHTML = "Get it delivered!"
  restaurantSectionTitle.appendChild(restaurantSectionTitleText)

  const restaurantSectionContent = document.createElement("div")
  restaurantSectionContent.id = "restaurant-section-content"
  restaurantSectionContent.classList.add("menu-section-content")  

  for(restaurant of restaurants) {
    const restaurantCard = document.createElement("div")
    restaurantCard.classList.add("restaurant-card")
    restaurantCard.classList.add("background-image")
    restaurantCard.style.backgroundImage = "url('" + restaurant.image+"')"
    restaurantCard.key= restaurant.id

    const restaurantCardContent = document.createElement("div")
    restaurantCardContent.classList.add("restaurant-card-content")

    const restaurantCardContentItems = document.createElement("div")
    restaurantCardContentItems.classList.add("restaurant-card-content-items")

    const restaurantCardTitle = document.createElement("span")
    restaurantCardTitle.classList.add("restaurant-card-title")
    restaurantCardTitle.innerHTML = restaurant.title

    const restaurantCardDesc = document.createElement("span")
    restaurantCardDesc.classList.add("restaurant-card-desc")
    restaurantCardDesc.innerHTML = restaurant.desc


    restaurantCardContentItems.appendChild(restaurantCardTitle)
    restaurantCardContentItems.appendChild(restaurantCardDesc)
    restaurantCardContent.appendChild(restaurantCardContentItems)
    restaurantCard.appendChild(restaurantCardContent)
    restaurantSectionContent.appendChild(restaurantCard)
  }

  restaurantSection.appendChild(restaurantSectionTitle)
  restaurantSection.appendChild(restaurantSectionContent)
  element.appendChild(restaurantSection)  
}

function createHappeningCards(element) {
  const tools = [{
      icon: 'fa-cloud',
      id: 1,
      image: "images/photo-1492011221367-f47e3ccd77a0.avif",
      label: "Weather",
      name: "Cloudly"
    }, {
      icon: "fa-calculator",
      id: 2,
      image: "images/photo-1587145820266-a5951ee6f620.avif",
      label: "Calc",
      name: "Mathio"
    }, {
      icon: "fa-money",
      id: 3,
      image: "images/photo-1579621970588-a35d0e7ab9b6.avif",
      label: "Bank",
      name: "Cashy"
    }, {
      icon: "fa-plane",
      id: 4,
      image: "images/photo-1436491865332-7a61a109cc05.avif",
      label: "Travel",
      name: "Fly-er-io-ly"
    }, {
      icon: "fa-gamepad",
      id: 5,
      image: "images/photo-1612287230202-1ff1d85d1bdf.avif",
      label: "Games",
      name: "Gamey"
    }, {
      icon: "fa-video-camera",
      id: 6,
      image: "images/photo-1578022761797-b8636ac1773c.avif",
      label: "Video Chat",
      name: "Chatty"
    }]

  const toolSection = document.createElement("div")
  toolSection.id = "tools-section"
  toolSection.classList.add("menu-section")

  const toolSectionTitle = document.createElement("div")
  toolSectionTitle.id = "tool-section-title"
  toolSectionTitle.classList.add("menu-section-title")

  const toolSectionTitleIcon = document.createElement("i")
  toolSectionTitleIcon.classList.add("fa")
  toolSectionTitleIcon.classList.add("fa-briefcase")
  toolSectionTitle.appendChild(toolSectionTitleIcon)  

  const toolSectionTitleText = document.createElement("span")
  toolSectionTitleText.classList.add("menu-section-title-text")
  toolSectionTitleText.innerHTML = "What's Happening?"
  toolSectionTitle.appendChild(toolSectionTitleText)

  const toolSectionContent = document.createElement("div")
  toolSectionContent.id = "tools-section-content"
  toolSectionContent.classList.add("menu-section-content")  

  for(tool of tools) {
    const toolCard = document.createElement("div")
    toolCard.classList.add("tool-card")
    toolCard.key= tool.id

    const toolCardBackground = document.createElement("div")
    toolCardBackground.classList.add("tool-card-background")
    toolCardBackground.classList.add("background-image")
    toolCardBackground.style.backgroundImage = "url('" + tool.image+"')"
    toolCard.appendChild(toolCardBackground)

    const toolCardContent = document.createElement("div")
    toolCardContent.classList.add("tool-card-content")

    const toolCardContentHeader = document.createElement("div")
    toolCardContentHeader.classList.add("tool-card-content-header")

    const toolCardTitle = document.createElement("span")
    toolCardTitle.classList.add("tool-card-label")
    toolCardTitle.innerHTML = tool.label

    const toolCardDesc = document.createElement("span")
    toolCardDesc.classList.add("tool-card-name")
    toolCardDesc.innerHTML = tool.name

    const toolCardIcon = document.createElement("i")
    toolCardIcon.classList.add("tool-card-icon")
    toolCardIcon.classList.add("fa")
    toolCardIcon.classList.add(tool.icon)


    toolCardContentHeader.appendChild(toolCardTitle)
    toolCardContentHeader.appendChild(toolCardDesc)
    toolCardContent.appendChild(toolCardContentHeader)
    toolCardContent.appendChild(toolCardIcon)
    toolCard.appendChild(toolCardContent)
    toolSectionContent.appendChild(toolCard)
  }

  toolSection.appendChild(toolSectionTitle)
  toolSection.appendChild(toolSectionContent)
  element.appendChild(toolSection)
}

function createMovieCardDiv(element) {
  const movies = [{
      desc: "A tale of some people watching over a large portion of space.",
      id: 1,
      icon: "fa-grav",
      image: "images/photo-1596727147705-61a532a659bd.avif",
      title: "Protectors of the Milky Way"
    }, {
      desc: "Some people leave their holes to disrupt some things.",
      id: 2,
      icon: "fa-magic",
      image: "images/photo-1535666669445-e8c15cd2e7d9.avif",
      title: "Hole People"
    }, {
      desc: "A boy with a dent in his head tries to stop a bad guy. And by bad I mean bad at winning.",
      id: 3,
      icon: "fa-fort-awesome",
      image: "images/photo-1632266484284-a11d9e3a460a.avif",
      title: "Pot of Hair"
    }, {
      desc: "A long drawn out story of some people fighting over some space. Cuz there isn't enough of it.",
      id: 4,
      icon: "fa-empire",
      image: "images/photo-1533613220915-609f661a6fe1.avif",
      title: "Area Fights"
    }]

  const movieSection = document.createElement("div")
  movieSection.id = "movies-section"
  movieSection.classList.add("menu-section")

  const movieSectionTitle = document.createElement("div")
  movieSectionTitle.id = "movie-section-title"
  movieSectionTitle.classList.add("menu-section-title")

  const movieSectionTitleIcon = document.createElement("i")
  movieSectionTitleIcon.classList.add("fa")
  movieSectionTitleIcon.classList.add("fa-film")
  movieSectionTitle.appendChild(movieSectionTitleIcon)  

  const movieSectionTitleText = document.createElement("span")
  movieSectionTitleText.classList.add("menu-section-title-text")
  movieSectionTitleText.innerHTML = "What's Happening?"
  movieSectionTitle.appendChild(movieSectionTitleText)

  const movieSectionContent = document.createElement("div")
  movieSectionContent.id = "movies-section-content"
  movieSectionContent.classList.add("menu-section-content")
  movieSectionContent.classList.add("scrollable-component")
  movieSectionContent.addEventListener("mousedown", (e) => {
    handleOnMouseDown(e, document.getElementById("movies-section-content"))
  });
  movieSectionContent.addEventListener("mousemove", (e) => {
    handleOnMouseMove(e, document.getElementById("movies-section-content"))
  });
  movieSectionContent.addEventListener("mouseup", () => {
    handleOnMouseUp()
  });
  movieSectionContent.addEventListener("mouseleave", () => {
    handleOnMouseUp()
  });  

  for(movie of movies) {
    const movieCard = document.createElement("div")
    movieCard.classList.add("movie-card")
    movieCard.key= movie.id

    const movieCardBackground = document.createElement("div")
    movieCardBackground.classList.add("movie-card-background")
    movieCardBackground.classList.add("background-image")
    movieCardBackground.style.backgroundImage = "url('" + movie.image+"')"
    movieCard.appendChild(movieCardBackground)

    const movieCardContent = document.createElement("div")
    movieCardContent.classList.add("movie-card-content")
    movieCardContent.classList.add("movie-card-content-" + movie.id)

    const movieCardContentInfo = document.createElement("div")
    movieCardContentInfo.classList.add("movie-card-info")

    const movieCardTitle = document.createElement("span")
    movieCardTitle.classList.add("movie-card-title")
    movieCardTitle.innerHTML = movie.title

    const movieCardDesc = document.createElement("span")
    movieCardDesc.classList.add("movie-card-desc")
    movieCardDesc.innerHTML = movie.desc

    const movieCardIcon = document.createElement("i")
    movieCardIcon.classList.add("movie-card-icon")
    movieCardIcon.classList.add("fa")
    movieCardIcon.classList.add(movie.icon)


    movieCardContentInfo.appendChild(movieCardTitle)
    movieCardContentInfo.appendChild(movieCardDesc)
    movieCardContent.appendChild(movieCardContentInfo)
    movieCardContent.appendChild(movieCardIcon)
    movieCard.appendChild(movieCardContent)
    movieSectionContent.appendChild(movieCard)
  }

  movieSection.appendChild(movieSectionTitle)
  movieSection.appendChild(movieSectionContent)
  element.appendChild(movieSection)
}
  




function setUserStatusTo(userStatus) {
  state = userStatus
  document.getElementById("app-background").classList.toggle("app-background-logged-out", state === UserStatus.LoggedOut)
  document.getElementById("sign-in-button-wrapper").classList.toggle("sign-in-button-wrapper-logged-out", state === UserStatus.LoggedOut)
  document.getElementById("app-info").classList.toggle("app-info-logged-out", state === UserStatus.LoggedOut)

  document.getElementById("app-background").classList.toggle("app-background-logging-in", state === UserStatus.LoggingIn || state === UserStatus.LogInError)
  document.getElementById("app-pin-wrapper").classList.toggle("app-pin-wrapper-logging-in", state === UserStatus.LoggingIn || state === UserStatus.LogInError)
  document.querySelectorAll('[id^="app-pin-digit"]').forEach(function(digit) {
    digit.classList.toggle("app-pin-digit", state === UserStatus.LoggingIn || state === UserStatus.LogInError)
    digit.classList.toggle("app-pin-digit-logging-in-error", state === UserStatus.LogInError)
  });

  document.getElementById("app-loading-icon").classList.toggle("app-loading-icon-verifying", state === UserStatus.VerifyingLogIn)

  document.getElementById("app-menu").classList.toggle("app-menu-logged-in", state === UserStatus.LoggedIn)  

    


  if (state == UserStatus.LoggedOut) {
    document.getElementById("sign-in-button").addEventListener("click", function() {
      setUserStatusTo(UserStatus.LoggingIn)
    })
  } else if (state == UserStatus.LoggingIn) {
    inputFocus()
  } else if (state == UserStatus.LoggedIn) {
    document.getElementById("sign-out-button").addEventListener("click", function() {
      setUserStatusTo(UserStatus.LoggedOut)
    })
  }
  
}

var state = UserStatus.LoggedOut
var previousTime = null
var pin =''
var focused = true
var grabbing = false
var position = null

function main() {

  document.getElementById("root").classList.add("logged-out")
  createAppBackground()
  createBounceButtonLoggedOut()
  createInfoContainer(document.getElementById("root"), "app")
  createPinWrapper()
  createLoadingIcon()

  createAppMenuContainer()
  
  displayCurrentTime()
  setUserStatusTo(UserStatus.LoggedOut)  
}

main()