class MessagesController < ApplicationController
  include Userable

  before_action :set_message, only: %i[ show edit update destroy ]

  # GET /messages or /messages.json
  def index
    users_list
    puts "#"*33
    puts "DANS LA METHODE INDEX"
    puts "#"*33
    @messages =  Message.all.order(created_at: :desc)
    @new_message = Message.new
  end

  # GET /messages/1 or /messages/1.json
  def show
  end

  # GET /messages/new
  def new
    @new_message ||= Message.new
  end

  # GET /messages/1/edit
  def edit
  end

  # POST /messages or /messages.json
  def create
    @new_message = Message.new(message_params)

    respond_to do |format|
      if @new_message.save
        @new_message = Message.new  # Réinitialisation de l'instance du message
        format.html { redirect_to messages_path, notice: "Message was successfully created." }
        format.json { render :index, status: :created, location: messages_path }
        format.turbo_stream
      else
        @messages = Message.all
        format.html { render :index, status: :unprocessable_entity }
        format.json { render json: @new_message.errors, status: :unprocessable_entity }
      end
    end

  end

  # PATCH/PUT /messages/1 or /messages/1.json
  def update
    @new_message = Message.new(message_params)

    respond_to do |format|
      if @new_message.update(message_params)
        format.html { redirect_to messages_path, notice: "Message was successfully updated." }
        format.json { render :show, status: :ok, location: messages_path }
        format.turbo_stream
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @new_message.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /messages/1 or /messages/1.json
  def destroy
    @message.destroy

    respond_to do |format|
      format.html { redirect_to messages_url, notice: "Message was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  def update_user_location
    puts "#"*33
    puts "DANS LA METHODE UPDATE_USER_LOCATION"
    puts "#"*33        
    puts "Params: #{params.inspect}"
    puts "Current user : #{current_user.id}"

    location = Location.find_or_initialize_by(user_id: current_user.id)
    location.latitude = user_location_params[:latitude]
    location.longitude = user_location_params[:longitude]

    if location.save
      render json: { message: "Coordonnées mises à jour avec succès." }
    else
      render json: { error: "Erreur lors de la mise à jour des coordonnées." }, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_message
      @message = Message.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def message_params
      params.require(:message).permit(:user_id, :content, :category)
    end

    def user_location_params
      params.require(:location).permit(:latitude, :longitude)
    end

end
