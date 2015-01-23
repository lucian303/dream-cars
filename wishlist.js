(function () {
    'use strict';

    angular.module('wishlist', []).controller('wishlistController', function ($scope) {
        /**
         * Check to see if a car has already been added to the wishlist
         *
         * @param selection
         * @returns {boolean}
         */
        function inWishlist(selection) {
            return !!(_.find($scope.wishlist, selection));
        }

        /**
         * Sort cars alphabetically by make and model
         *
         * @param cars
         * @returns {Array}
         */
        function sortCars(cars) {
            return _.sortBy(cars, ['make', 'model']);
        }

        /**
         * Find the first car of the same make as the selected car if one exists,
         * otherwise return the first car in the list
         *
         * @param selection
         * @returns {Array|Boolean}
         */
        function getNewSelection(selection) {
            var foundCar = false;

            _.forEach($scope.cars, function (car, index) {
                if (car.make === selection.make) {
                    foundCar = $scope.cars[index];
                    return false; // break the loop so we get the first alphabetical match
                }
            });

            if (!foundCar && $scope.cars[0]) {
                return $scope.cars[0];
            }

            return foundCar;
        }

        /**
         * Add the current selection to the wishlist and remove it from the select dropdown
         */
        $scope.add = function () {
            var newSelection;

            if ($scope.selection && !inWishlist($scope.selection)) {
                // Add car to wishlist
                $scope.wishlist.push($scope.selection);

                // Remove from dropdown
                $scope.cars = _.filter($scope.cars, function (car) {
                    return !!(car.make !== $scope.selection.make || car.model !== $scope.selection.model);
                });

                // Change the selection to the first car with the same make
                // or the first car in the list (unless the list is empty)
                if (newSelection = getNewSelection($scope.selection)) {
                    $scope.selection = newSelection;
                }
            }
        };

        /**
         * Remove a car from the wishlist
         *
         * @param car
         */
        $scope.remove = function (car) {
            // Add car back to dropdown and re-sort
            $scope.cars.push(car);
            $scope.cars = sortCars($scope.cars);

            // Remove from wishlist
            $scope.wishlist = _.filter($scope.wishlist, function (value) {
                return !!(car.make !== value.make || car.model !== value.model);
            });
        };

        /**
         * Initialize UI on startup
         */
        function init() {
            $scope.cars = sortCars(dreamCars);
            $scope.wishlist = [];
        }

        init();
    });
}());
