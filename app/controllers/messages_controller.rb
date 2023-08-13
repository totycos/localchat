class MessagesController < ApplicationController
  before_action :set_message, only: %i[ show edit update destroy ]

  # GET /messages or /messages.json
  def index
    @messages = Message.all
    @new_message = Message.new
  end

  # GET /messages/1 or /messages/1.json
  def show
  end

  # GET /messages/new
  def new
    @message = Message.new
  end

  # GET /messages/1/edit
  def edit
  end

  # POST /messages or /messages.json
  def create
    @new_message = Message.new(message_params)

    respond_to do |format|
      if @new_message.save
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

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_message
      @message = Message.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def message_params
      params.require(:message).permit(:user_id, :content, :category)
    end
end
