module Userable

  def users_list
    @users = User.all.includes(:location)
  end

end