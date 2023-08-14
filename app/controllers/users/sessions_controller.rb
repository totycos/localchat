# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  after_action :update_coordinates, only: [:create]
 
  def update_coordinates
    location = current_user.location
  
    if location
      location.update(latitude: params[:latitude], longitude: params[:longitude])
    else
      location = current_user.build_location(latitude: params[:latitude], longitude: params[:longitude])
      location.save
    end
  
  end

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  # def create
  #   super
  # end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end
end
