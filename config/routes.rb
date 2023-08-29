Rails.application.routes.draw do

  root "messages#index"

  resources :messages do
    patch :update_user_location, on: :collection
    patch :update_chat_setting, on: :collection
  end

  # Routes personnalisées pour les utilisateurs
  resources :users, only: [:index, :edit, :update] do
    patch :update_user_location, on: :collection
    get :profile, on: :member  
  end
  
  devise_for :users


  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
end
