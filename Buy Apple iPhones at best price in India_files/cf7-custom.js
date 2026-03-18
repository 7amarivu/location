jQuery(document).ready(function ($) {
    let cityOptions = {
        "Delhi": ["Los Angeles", "San Francisco", "San Diego"],
        "Haryana": ["Houston", "Dallas", "Austin"],
        "Himachal Prades": ["New York City", "Buffalo", "Rochester"],
        "Karnataka": ["Los Angeles", "San Francisco", "San Diego"],
        "Madhya Pradesh": ["Houston", "Dallas", "Austin"],
        "Uttar Pradesh": ["New York City", "Buffalo", "Rochester"]
    };

    $("#state-dropdown").change(function () {
        let selectedState = $(this).val();
        let $cityDropdown = $("#city-dropdown");

        $cityDropdown.empty();
        $cityDropdown.append('<option value="">Select a City</option>');

        if (selectedState && selectedState in cityOptions) {
            cityOptions[selectedState].forEach(function (city) {
                $cityDropdown.append('<option value="' + city + '">' + city + '</option>');
            });
        }
    });
});
