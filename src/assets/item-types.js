export const ItemTypes = [ 'Switch', 'Contact', 'String', 'Number', 'Dimmer', 'DateTime', 'Color', 'Image', 'Player', 'Location', 'Rollershutter', 'Group' ]
export const GroupTypes = [ 'None', 'Switch', 'Contact', 'Number', 'Dimmer', 'Rollershutter', 'DateTime' ]
export const Dimensions = [ '', 'Temperature', 'Pressure', 'Speed', 'Length', 'Angle', 'Intensity', 'Dimensionless', 'Acceleration', 'AmountOfSubstance', 'AngularAcceleration', 'AngularVelocity', 'Area', 'CatalyticActivity', 'DataAmount', 'DataRate', 'Duration', 'DynamicViscosity', 'ElectricCapacitance', 'ElectricCharge', 'ElectricConductance', 'ElectricCurrent', 'ElectricInductance', 'ElectricPotential', 'ElectricResistance', 'Energy', 'Force', 'Frequency', 'Illuminance', 'KinematicViscosity', 'LuminousFlux', 'LuminousIntensity', 'MagneticFlux', 'MagneticFluxDensity', 'Mass', 'MassFlowRate', 'Power', 'RadiationDoseAbsorbed', 'RadiationDoseEffective', 'RadioactiveActivity', 'SolidAngle', 'Torque', 'Velocity', 'Time', 'Volume', 'VolumetricDensity', 'VolumetricFlowRate' ]

export const ArithmeticFunctions = [ {
  name: '',
  value: 'None'
}, {
  name: 'AVG',
  value: 'AVG'
}, {
  name: 'MAX',
  value: 'MAX'
}, {
  name: 'MIN',
  value: 'MIN'
}, {
  name: 'SUM',
  value: 'SUM'
} ]

export const LogicalOnOffFunctions = [ {
  name: '',
  value: 'None'
}, {
  name: 'AND_ON_OFF',
  value: 'All ON → ON else OFF'
}, {
  name: 'NAND_ON_OFF',
  value: 'All ON → OFF else ON'
}, {
  name: 'AND_OFF_ON',
  value: 'All OFF → OFF else ON'
}, {
  name: 'NAND_OFF_ON',
  value: 'All OFF → ON else OFF'
}, {
  name: 'OR_ON_OFF',
  value: 'One ON → ON else OFF'
}, {
  name: 'NOR_ON_OFF',
  value: 'One ON → OFF else ON'
}, {
  name: 'OR_OFF_ON',
  value: 'One OFF → OFF else ON'
}, {
  name: 'NOR_OFF_ON',
  value: 'One OFF → ON else OFF'
} ]

export const LogicalOpenClosedFunctions = [ {
  name: '',
  value: 'None'
}, {
  name: 'AND_OPEN_CLOSED',
  value: 'All OPEN → OPEN else CLOSED'
}, {
  name: 'NAND_OPEN_CLOSED',
  value: 'All OPEN → CLOSED else OPEN'
}, {
  name: 'AND_CLOSED_OPEN',
  value: 'All CLOSED → CLOSED else OPEN'
}, {
  name: 'NAND_CLOSED_OPEN',
  value: 'All CLOSED → OPEN else CLOSED'
}, {
  name: 'OR_OPEN_CLOSED',
  value: 'One OPEN → OPEN else CLOSED'
}, {
  name: 'NOR_OPEN_CLOSED',
  value: 'One OPEN → CLOSED else OPEN'
}, {
  name: 'OR_CLOSED_OPEN',
  value: 'One CLOSED → CLOSED else OPEN'
}, {
  name: 'NOR_CLOSED_OPEN',
  value: 'One CLOSED → OPEN else CLOSED'
} ]

export const DateTimeFunctions = [ {
  name: '',
  value: 'None'
}, {
  name: 'EARLIEST',
  value: 'EARLIEST'
}, {
  name: 'LATEST',
  value: 'LATEST'
} ]