## General Types

ocfSecurityProfileOID ::= UTF8String
ocfSecurityClaimsOID ::= OBJECT IDENTIFIER

ocfVersion: {
  major: x,
  minor: y,
  build: z
},

## OCF Compliance Extension

oid: 1.3.6.1.4.1.51414.1.0,
critical: false,

ocfCompliance {
  version: [1, 0, 0],
  securityProfile : [          // ocfSecurityProfileOID's
    '1.3.6.1.4.1.51414.0.1.0', // baseline
    '1.3.6.1.4.1.51414.0.2.0', // black
    '1.3.6.1.4.1.51414.0.3.0', // blue
    '1.3.6.1.4.1.51414.0.4.0'  // purple
  ],
  deviceName: 'name'
  deviceManufacturer: 'mfg'
  }
}

## Security Claims Extension

oid: 1.3.6.1.4.1.51414.1.1,
critical: false,

ocfSecurityClaims [        // ocfSecurityClaimsOIDs
  1.3.6.1.4.1.51414.1.1.0, // claim-secure-boot
  1.3.6.1.4.1.51414.1.1.1,  // claim-hw-backed-cred-storage
]

## Certified Product List Attributes

oid: 1.3.6.1.4.1.51414.1.2
critical: false,

// How are these used?
cpl-at-IANAPen = 1.3.6.1.4.1.51414.1.2.0 (?)
cpl-at-model = 1.3.6.1.4.1.51414.1.2.1 (?)
cpl-at-version = 1.3.6.1.4.1.51414.1.2.2 (?)

// This does not look right?
ocfCPLAttributes {
  “1.3.6.1.4.1.71” // 1.3.6.1.4.1.51414.1.2.0 // cpl-at-IANAPen
  “Discovery”,    //  1.3.6.1.4.1.51414.1.2.1 // cpl-at-model
  “1.0” //  1.3.6.1.4.1.51414.1.2.2 // cpl-at-version
}


