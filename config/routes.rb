Rails.application.routes.draw do

  root "messages#index"

  resources :users

  resources :messages do
    patch :update_user_location, on: :collection
    patch :update_chat_setting, on: :collection
  end
  
  devise_for :users

  resources :users, only: [] do
    patch :update_user_location, on: :collection
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
end
