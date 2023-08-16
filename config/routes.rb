Rails.application.routes.draw do
  resources :messages do
    patch :update_user_location, on: :collection
  end
  
  devise_for :users

  resources :users, only: [] do
    patch :update_user_location, on: :collection
  end
  
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "messages#index"
end
