import React, { useState, useRef } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

interface Option {
  Label: string;
  Value: string;
}

const Addsegment = () => {
  const [showpopup, setShowpopup] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [displaySelectedItems, setDisplaySelectedItems] = useState<string[]>(
    []
  );

  const schemaOptions: Option[] = [
    { Label: 'First Name', Value: 'first_name' },
    { Label: 'Last Name', Value: 'last_name' },
    { Label: 'Gender', Value: 'gender' },
    { Label: 'Age', Value: 'age' },
    { Label: 'Account Name', Value: 'account_name' },
    { Label: 'City', Value: 'city' },
    { Label: 'State', Value: 'state' },
  ];

  const handleShow = () => setShowpopup(true);
  const handleClose = () => setShowpopup(false);

  const handleAddSchema = () => {
    if (selectedItem) {
      setDisplaySelectedItems([selectedItem, ...displaySelectedItems]);
      setSelectedItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    const newSchemas = [...displaySelectedItems];
    newSchemas.splice(index, 1);
    setDisplaySelectedItems(newSchemas);
  };

  const availableOptions = schemaOptions.filter(
    (option) => !displaySelectedItems.includes(option.Value)
  );

  const handleSchemaChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const newSchemas = [...displaySelectedItems];
    newSchemas[index] = e.target.value;
    setDisplaySelectedItems(newSchemas);
  };

  const handleSaveSegment = () => {
    const schema = displaySelectedItems.map((schema) => ({
      [schema]: schemaOptions.find((option) => option.Value === schema)?.Label,
    }));

    const segmentData = {
      segment_name: segmentName,
      schema,
    };

    console.log(segmentData);
    fetch('https://webhook.site/8294d022-122a-4629-aeb9-c7a0a2a4e6c0', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(segmentData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        setDisplaySelectedItems([]);
        setSegmentName('');
        handleClose();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const getClassForSchema = (schema: string) => {
    return schema === 'account_name'
      ? 'traits_color traits_width traits_red'
      : 'traits_color traits_width traits_green';
  };

  // Refs to control select elements
  const selectRefs = useRef<(HTMLSelectElement | null)[]>([]);
  const mainSelectRef = useRef<HTMLSelectElement | null>(null);

  const handleIconClick = (index: number) => {
    if (index >= 0) {
      const event = new MouseEvent('mousedown', { bubbles: true });
      selectRefs.current[index]?.dispatchEvent(event);
    } else {
      const event = new MouseEvent('mousedown', { bubbles: true });
      mainSelectRef.current?.dispatchEvent(event);
    }
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Save segment
      </Button>

      <Modal show={showpopup} onHide={handleClose} className="segment_modal">
        <Modal.Header closeButton>
          <Modal.Title>Saving Segment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="name_input">
            <label>Enter the Name of the Segment</label>
            <input
              name="segmentName"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
              placeholder="Name of the segment"
            />
          </div>
          <p>
            To save your segments you need to add schemas to build the query
          </p>
          <div className="traits_flx">
            <div>
              <span className="traits_color traits_green"></span>
              <span>-User Traits</span>
            </div>
            <div>
              <span className="traits_color traits_red"></span>
              <span>-Group Traits</span>
            </div>
          </div>

          <div className="">
            {displaySelectedItems.map((schema, index) => (
              <Form.Group
                key={index}
                className="mt-2 remove_select position-relative"
              >
                <span className={getClassForSchema(schema)}></span>
                <Form.Control
                  as="select"
                  value={schema}
                  onChange={(e) => handleSchemaChange(e, index)}
                  ref={(el: HTMLSelectElement | null) => (selectRefs.current[index] = el)}
                >
                  <option value="">Select schema</option>
                  {schemaOptions.map((option) => (
                    <option key={option.Value} value={option.Value}>
                      {option.Label}
                    </option>
                  ))}
                </Form.Control>
                <div
                  className="remove_div"
                  onClick={() => handleRemoveItem(index)}
                >
                  <span className="minus_number"></span>
                </div>
                <FontAwesomeIcon
                  icon={faCaretDown}
                  className="select-icon"
                  onClick={() => handleIconClick(index)}
                />
              </Form.Group>
            ))}
          </div>

          <Form.Group className="mt-1 position-relative select_traits_reltive">
            <Form.Label>Add schema to segment</Form.Label>
            <div className="grey_traits">
              <span className="traits_color grey_width  traits_grey"></span>
              <Form.Control
                as="select"
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                ref={mainSelectRef}
              >
                <option value="" disabled>
                  Select schema
                </option>
                {availableOptions.map((option) => (
                  <option key={option.Value} value={option.Value}>
                    {option.Label}
                  </option>
                ))}
              </Form.Control>
            </div>
            <FontAwesomeIcon
              icon={faCaretDown}
              className="select-icon"
              onClick={() => handleIconClick(-1)}
            />
          </Form.Group>
          <div className='add_click' onClick={handleAddSchema}>+ Add new schema</div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="save_btn" onClick={handleSaveSegment}>
            Save the segment
          </Button>
          <Button className='cancel_btn' variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Addsegment;
