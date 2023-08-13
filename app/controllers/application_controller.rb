class ApplicationController < ActionController::Base
  before_action :configure_devise_parameters, if: :devise_controller?

  def configure_devise_parameters
    devise_parameter_sanitizer.permit(:sign_up) { |u| u.permit(:pseudo, :email, :password, :password_comfirmation)}
    devise_parameter_sanitizer.permit(:account_update) { |u| u.permit(:pseudo, :email, :password, :password_comfirmation)}
  end

end
