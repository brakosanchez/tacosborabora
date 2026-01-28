type ChannelType = 'Local' | 'Para llevar' | 'Domicilio';

interface ChannelSelectorProps {
  selectedChannel: ChannelType;
  onSelectChannel: (channel: ChannelType) => void;
}

const CHANNELS: ChannelType[] = ['Local', 'Para llevar', 'Domicilio'];

const ChannelSelector = ({ selectedChannel, onSelectChannel }: ChannelSelectorProps) => {
  const handleChannelSelect = (channel: ChannelType) => {
    onSelectChannel(channel);
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Tipo de pedido</h3>
      <div className="grid grid-cols-3 gap-2">
        {CHANNELS.map((channel) => (
          <button
            key={channel}
            type="button"
            onClick={() => handleChannelSelect(channel)}
            className={`px-3 py-2 text-sm rounded-md transition-colors ${
              selectedChannel === channel
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {channel}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChannelSelector;