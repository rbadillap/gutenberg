/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import {
	store as blockEditorStore,
	InnerBlocks,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';

const PatternEdit = ( { attributes, clientId, isSelected } ) => {
	const selectedPattern = useSelect(
		( select ) =>
			select( blockEditorStore ).__experimentalGetParsedPattern(
				attributes.slug
			),
		[ attributes.slug ]
	);

	const hasSelection = useSelect(
		( select ) =>
			isSelected ||
			select( blockEditorStore ).hasSelectedInnerBlock( clientId, true ),
		[ isSelected, clientId ]
	);

	const {
		replaceBlocks,
		replaceInnerBlocks,
		__unstableMarkNextChangeAsNotPersistent,
	} = useDispatch( blockEditorStore );

	// Run this effect when the block, or any of its InnerBlocks are selected.
	// This replaces the Pattern block wrapper with the content of the pattern.
	// This change won't be saved unless further changes are made to the InnerBlocks.
	useEffect( () => {
		if ( hasSelection && selectedPattern?.blocks ) {
			__unstableMarkNextChangeAsNotPersistent();
			replaceBlocks( clientId, selectedPattern.blocks );
		}
	}, [ hasSelection, selectedPattern?.blocks ] );

	// Run this effect when the component loads.
	// This adds the Pattern block template as InnerBlocks.
	// This change won't be saved.
	useEffect( () => {
		if ( selectedPattern?.blocks ) {
			__unstableMarkNextChangeAsNotPersistent();
			replaceInnerBlocks( clientId, selectedPattern.blocks );
		}
	}, [ selectedPattern?.blocks ] );

	const props = useInnerBlocksProps( useBlockProps(), {} );

	return <InnerBlocks { ...props } />;
};

export default PatternEdit;
