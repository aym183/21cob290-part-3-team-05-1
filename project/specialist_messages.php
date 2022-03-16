<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles/styles.css">
    <title>Specialist Home Page</title>
</head>
<body>

    <div class="topSection">
        
        <!-- TOP NAVBAR SECTION -->
        <div class="topNavbar">
            <div class="topNavbar__container">
                <div class="topNavbar__item">
                    <div class="topNavbar__logo">
                        <a href="intSpecialist.php" id="navbar__logo">TEAM-05</a>
                    </div>    
                    <div class="topNavbar__search" id="search-div">
                        <div class="search__container">
                            <form>
                                <button class = "searchButtons" id="filter-btn"><i class="fas fa-sliders-h"></i></button>
                                <input class="searchInput" type="text" placeholder="Search Ticket">
                                <button class="searchButtons" type="button" id="search-btn"><i class="fa fa-search" aria-hidden="true"></i></button>
                            </form>
                        </div>
                        <!-- Search Filters -->
                        <div class="dropdownFilters">
                            <p class= "filter-tag">Status</p>
        
                            <select id ="filter-status" name="status" class="filter-status">
                                <option value="all">All</option>
                                <option value="closed">Closed</option>
                                <option value="active">Active</option>
                                <option value="submitted">Submitted</option>
                                <option value="dropped">Dropped</option>
                            </select>
                            <p class= "filter-tag">Ticket ID</p>
                            <input type="text" class="filter-search" id ="filter-id">
                            <p class= "filter-tag">Problem Type</p>
                            <input type="text" class="filter-search" id ="filter-type">
                            <p class= "filter-tag">Caller Name</p>
                            <input type="text" class="filter-search" id ="filter-cname">
                            <p class= "filter-tag">Handler Name</p>
                            <input type="text" class="filter-search" id ="filter-sname">
                            <p class= "filter-tag filter-date1">Last Updated Range</p>
                            <div class="input-date1">
                                <input id = "date1" type="date" data-date-inline-picker="true" name="date-search1" class="filter-search input-date-created" placeholder="Created">
                                <div class="date__dropdown dropdown1"></div>
                            </div>
                            <div class="input-date2">
                                <input id = "date2" type="date" data-date-inline-picker="true" name="date-search2" class="filter-search input-date-closed" placeholder="Closed">
                                <div class="date__dropdown dropdown2"></div>
                            </div>
                            <select id ="filter-custom" name="custom" class="filter-status">
                                <option value="employee_id">Employee ID</option>
                                <option value="operator_id">Operator ID</option>
                                <option value="handler_id">Handler ID</option>
                                <option value="operating_system">OS</option>
                                <option value="number_of_drops">No. of Drops ></option>
                                <option value="softw_name">Software</option>
                                <option value="hardw_name">Hardware</option>
                            </select>
                            <input type="text" class="filter-search" id ="filter-custom-value">
                            <div id="none-found" style="display:none;">
                                No Results Found
                            </div>
                            <div class="dropdown-button-wrapper">
                                <button class="dropdown-btn">Search</button>
                            </div>
                        </div>        
                    </div>
                </div>

                <div class="profile__container">
                    <a href="specialist_account.php" class="profile__item" id="profile-username">

                        <p id="username">Specialist</p>
                        <!--This is James part
                        -->
                        <!-- <?php
                            echo '<p id="username">'. $uname .'</p>'
                        ?> -->
                    </a>
                </div>
            </div>
        </div>
        
    </div>
    <div class="main__section">

        <!-- SIDE NAVBAR SECTION -->
        <div class="navbar">
            <div class="navbar__container">
                <ul class="navbar__menu">
                    <a href="intSpecialist.php" class="navbar__item-div">
                        <li class="navbar__item">
                            <p><i class="fas fa-home"></i></p>
                            <p class="navbar__links">Home</p>
                        </li>
                    </a>     
                    <a href="specialist_messages.php" class="navbar__item-div">
                        <li class="navbar__item">
                            <p><i class="fas fa-plus"></i></p>
                            <p class="navbar__links">Notifications</p>
                        </li>
                    </a>               
                    <a href="specialist_account.php" class="navbar__item-div">
                        <li class="navbar__item">
                            <p><i class="fas fa-user"></i></p>
                            <p class="navbar__links">Account</p>
                        </li>
                    </a>
                </ul>
            </div>
        </div>

        <!-- TICKET TABLE SECTION -->
        <div class="mainSection__container" id="ticketList-container">
            
            <h5> Notifications </h5>
            <div class="account__section"></div>
        </div>

        
        
    </div>
    <script src="scripts/app.js">
        $(document).ready(function () {
            $(document.body).on("click", "#navbar__logo", function(e) {
                e.preventDefault();
                $("#ticketList-container").css("display", "flex")
        
                $("#ticket-info").css("display", "none")
                $("#info-headers").css("display", "none")
            });
        });
    </script>
    <script src="scripts/searchbar.js" type="text/javascript"></script>
    <script src="scripts/function.js"></script>
</body>
</html>
© 2022 GitHub, Inc.
Terms
Privacy
Security