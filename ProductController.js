app.controller('ProductController', function($scope, $location, ProductService) {

    $scope.products = [];
    $scope.newProduct = {}; // For the form
    $scope.errorMessage = '';

    // Function to load all products from the service
    function loadProducts() {
        $scope.errorMessage = '';
        ProductService.getAll()
            .then(function(response) {
                // Success
                $scope.products = response.data;
            })
            .catch(function(err) {
                // Failure (e.g., backend is not running)
                console.error('Error loading products', err);
                $scope.errorMessage = 'Could not load products. Is the backend server running?';
            });
    }

    // Function for the "Add Product" form
    $scope.addProduct = function() {
        ProductService.create($scope.newProduct)
            .then(function(response) {
                // Success! Clear the form and go back to the product list
                $scope.newProduct = {};
                $location.path('/products');
            })
            .catch(function(err) {
                console.error('Error adding product', err);
                $scope.errorMessage = 'Could not add product.';
            });
    };

    // Function for the "Delete" button
    $scope.deleteProduct = function(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            ProductService.delete(id)
                .then(function(response) {
                    // Success! Reload the list to show the change
                    loadProducts();
                })
                .catch(function(err) {
                    console.error('Error deleting product', err);
                    $scope.errorMessage = 'Could not delete product.';
                });
        }
    };

    // --- Load products automatically when the controller starts ---
    loadProducts();
});